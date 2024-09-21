import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyGameSnapshot } from "../initialCards";
import { locateCard, locatePlace } from "../helperFunctions/locateFunctions";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameSnapshotUpdates/rearrangeGCZ";
import { rearrangeSpecialsZone } from "../helperFunctions/gameSnapshotUpdates/rearrangeSpecialsZone";
import { getLeftOrRightNeighbour } from "../helperFunctions/canEnchantNeighbour";
import store from "./store";


const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

export interface DragEventState {
  gameSnapshot: GameSnapshot;
  screenSize: { width: number; height: number };
  transitionData: TransitionData[];
  draggedOver?: DraggedOverData;
  BFFdraggedOverSide?: string;
  rearrangingData: SimpleRearrangingData;
  draggedHandCard?: GameCard;
  highlights: number[];
  highlightType: string;
  // aiPlaying: string;
}

const isGCZ = (placeId: number, gameSnapshot: GameSnapshot) => locatePlace(placeId, gameSnapshot).placeType === "guestCardZone";

const isSpecialsZone = (type: DroppableEntityType, placeId: number, gameSnapshot: GameSnapshot) => {
  if (type !== "place") return false;
  return locatePlace(placeId, gameSnapshot).placeType === "specialsZone";
};

const isSpecialsColumn = (type: DroppableEntityType, id: number, gameSnapshot: GameSnapshot) => {
  if (type !== "cardGroup") return false;
  return locateCard(id, gameSnapshot).placeType === "specialsZone";
};

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.action.actionType === "enchantWithBff";


export interface DragEventState {
  gameSnapshot: GameSnapshot;
  screenSize: { width: number; height: number };
  transitionData: TransitionData[];
  draggedOver?: DraggedOverData;
  BFFdraggedOverSide?: string;
  rearrangingData: SimpleRearrangingData;
  draggedHandCard?: GameCard;
  highlights: number[];
  highlightType: string;
}

const initialState: DragEventState = {
  gameSnapshot: emptyGameSnapshot,
  screenSize: getScreenSize(),
  draggedOver: undefined,
  BFFdraggedOverSide: undefined,
  transitionData: [],
  rearrangingData: { placeId: -1, draggedId: -1, sourceIndex: -1 },
  draggedHandCard: undefined,
  highlights: [],
  highlightType: "",
};

export const dragEventSlice = createSlice({
  name: "dragEventState",
  initialState,
  reducers: {
    SET_SCREEN_SIZE: state => {
      state.screenSize = getScreenSize();
    },
    // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
    // be altered
    SET_DRAGGED_HAND_CARD: (state, action: PayloadAction<string>) => {
      const draggableId = action.payload;
      if (!draggableId) {
        state.draggedHandCard = undefined;
        return;
      }
      const { id } = JSON.parse(draggableId);
      state.draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === id);
    },
    START_REARRANGING: (state, action: PayloadAction<SimpleRearrangingData>) => {
      console.log(action.payload);
      return { ...state, rearrangingData: action.payload };
    },
    SET_HIGHLIGHTS: state => {
      // if(!phaseNormalTurnIsYours) return state;
      const draggedHandCard = state.draggedHandCard; //getDraggedHandCard(state, draggableId);
      if (draggedHandCard) {
        state.highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        console.log(state.highlights);
        state.highlightType = draggedHandCard.action.highlightType;
      }
    },
    UPDATE_DRAGGED_OVER: (state, action: PayloadAction<DraggedOverData | undefined>) => {
      const gameSnapshot = store.getState().gameSnapshotState.currSnapshot;
      console.log(`UPDATE_DRAGGED_OVER`);
      if (action.payload === undefined) {
        state.draggedOver = undefined;
        return;
      }
      const { id, index, type } = action.payload as DraggedOverData;
      const placeName = locatePlace(id, state.gameSnapshot).placeType;
      console.log(`Dragged over ${placeName}: (id ${id}) at calculated index: ${index}`);

      if (isEnchantWithBFF(state.draggedHandCard)) {
        state.BFFdraggedOverSide = getLeftOrRightNeighbour(state.gameSnapshot, id);
        state.draggedOver = action.payload;
      }
      if (isSpecialsColumn(type, id, state.gameSnapshot)) {
        console.log(`Dragged over specials column at calculated index: ${index}`);
        /// TODO not sure why we set it to 0 here
        state.draggedOver = { type, id, index: 0 };
      }
      return { ...state, draggedOver: action.payload };
    },
    SET_GAME_SNAPSHOT: (state, action: PayloadAction<GameSnapshot>) => {
      console.log("Setting game snapshot");
      state.gameSnapshot = action.payload;
    },
    REARRANGE: (state, action: PayloadAction<{ source: DraggedOverData; destination: DraggedOverData }>) => {
      const { source, destination } = action.payload;
      if (isGCZ(source.id, state.gameSnapshot)) {
        state.gameSnapshot = rearrangeGCZ(state.gameSnapshot, source.index, destination.index);
      } else if (isSpecialsZone(source.type, source.id, state.gameSnapshot)) {
        state.gameSnapshot = rearrangeSpecialsZone(state.gameSnapshot, source.index, destination.index);
      }
    },

    END_DRAG_CLEANUP: state => {
      console.log("Clean up!")
      const rearrangingData: SimpleRearrangingData = { placeId: -1, draggedId: -1, sourceIndex: -1 };
      return {
        ...state,
        draggedHandCard: undefined,
        highlights: [],
        highlightType: "",
        draggedOver: undefined,
        BFFdraggedOverSide: undefined,
        rearrangingData,
      };
      // case "ADD_TRANSITION":
      //   return { ...state, transitionData: [...state.transitionData, action.payload] };
      // case "REMOVE_TRANSITION":
      //   const transitionData = state.transitionData.filter(td => td.cardId !== action.payload);
      //   return { ...state, transitionData };
    },
  },
});

export default dragEventSlice.reducer;

export const {
  SET_SCREEN_SIZE,
  SET_DRAGGED_HAND_CARD,
  START_REARRANGING,
  SET_HIGHLIGHTS,
  UPDATE_DRAGGED_OVER,
  SET_GAME_SNAPSHOT,
  REARRANGE,
  END_DRAG_CLEANUP,
} = dragEventSlice.actions;
