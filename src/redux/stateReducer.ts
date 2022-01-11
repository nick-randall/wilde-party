import { DraggableLocation } from "react-beautiful-dnd";
import { addDraggedUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/addDragged";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameSnapshotUpdates/rearrangeGCZ";
import { locate } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { enchant } from "../helperFunctions/gameSnapshotUpdates/enchant";
import { getLeftOrRightNeighbour } from "../helperFunctions/canEnchantNeighbour";
import { rearrangeSpecialsZone } from "../helperFunctions/gameSnapshotUpdates/rearrangeSpecialsZone";
import { drawCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/drawCard";
import { produce } from "immer";
import { generateGame } from "../createGameSnapshot/old_create_Game";
import { createGameSnapshot } from "../createGameSnapshot/createGameSnapshot";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0  
}

export interface State {
  gameSnapshot: GameSnapshot;
  screenSize: { width: number; height: number };
  transitionData: TransitionData[];
  dragUpdate: UpdateDragData;
  BFFdraggedOverSide: string | undefined;
  rearrangingData: SimpleRearrangingData;
  draggedHandCard: GameCard | undefined;
  highlights: string[];
  highlightType: string;
}

const isGCZ = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "GCZ";

const isSpecialsZone = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "specialsZone";

const getDraggedHandCard = (state: State, draggableId: string | undefined) =>
  draggableId ? state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.action.actionType === "enchantWithBff";

export const stateReducer = (
  state: State = {
    gameSnapshot: createGameSnapshot(),
    screenSize: getScreenSize(),
    dragUpdate: { droppableId: "", index: -1 },
    BFFdraggedOverSide: undefined,
    transitionData: [],
    rearrangingData: { placeId: "", draggableId: "", sourceIndex: -1 },
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
  },
  action: Action
) => {
  switch (action.type) {
    case "SET_SCREEN_SIZE":
      return { ...state, screenSize: getScreenSize() };
    // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
    // be altered
    case "SET_DRAGGED_HAND_CARD":
      const draggableId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId);
      return { ...state, draggedHandCard: draggedHandCard };
    case "START_REARRANGING": {
      return { ...state, rearrangingData: action.payload };
    }
    case "SET_HIGHLIGHTS": {
      const draggedHandCard = state.draggedHandCard; //getDraggedHandCard(state, draggableId);
      if (draggedHandCard) {
        const highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        const highlightType = draggedHandCard.action.highlightType;
        return { ...state, highlights, highlightType };
      } else return state;
    }
    case "UPDATE_DRAG": {
      if (isEnchantWithBFF(state.draggedHandCard)) {
        const { droppableId } = action.payload;
        const BFFdraggedOverSide = getLeftOrRightNeighbour(state.gameSnapshot, droppableId);
        return { ...state, dragUpdate: action.payload, BFFdraggedOverSide };
      } else return { ...state, dragUpdate: action.payload };
    }
    case "REARRANGE": {
      const { source, destination } = action.payload;
      if (isGCZ(source, state.gameSnapshot)) {
        const gameSnapshot = rearrangeGCZ(state.gameSnapshot, source.index, destination.index);
        return { ...state, gameSnapshot };
      } else if (isSpecialsZone(source, state.gameSnapshot)) {
        const gameSnapshot = rearrangeSpecialsZone(state.gameSnapshot, source.index, destination.index);
        return { ...state, gameSnapshot };
      } else return state;
    }
    case "ADD_DRAGGED": {
      const { source, destination } = action.payload;
      console.log((destination.droppableId.slice(0,5)))
      // if(destination.droppableId.slice(4))

      const gameSnapshot = addDraggedUpdateSnapshot(state.gameSnapshot, source.droppableId, source.index, destination.droppableId, destination.index);
      return { ...state, gameSnapshot };
    }
    case "ENCHANT":
      // Here "destination.droppableId" is actually the card that is being enchanted.
      const { source, destination } = action.payload;
      if (destination) {
        const gameSnapshot = enchant(state.gameSnapshot, source.index, destination.droppableId);
        return { ...state, gameSnapshot };
      } else return state;
    case "DRAW_CARD":
      if (state.gameSnapshot.nonPlayerPlaces.deck.cards.length === 0) return state;
      const { player, handId } = action.payload;
      const gameSnapshot = drawCardUpdateSnapshot(handId, player, state.gameSnapshot);
      return { ...state, gameSnapshot };

    // return { ...state, gameSnapshot, transitionData: [...state.transitionData, newTransition] };
    case "END_DRAG_CLEANUP":
      return {
        ...state,
        draggedHandCard: undefined,
        highlights: [],
        highlightType: "",
        dragUpdate: { droppableId: "", index: -1 },
        BFFdraggedOverSide: undefined,
        rearrangingData: { placeId: "", draggableId: "", sourceIndex: -1 },
      };
    case "ADD_TRANSITION":
      return { ...state, transitionData: [...state.transitionData, action.payload] };
    case "REMOVE_TRANSITION":
      const transitionData = state.transitionData.filter(td => td.cardId !== action.payload);
      return { ...state, transitionData };
    case "CHANGE_NUM_DRAWS": {
      const change = action.payload;
      const newSnapshot = produce(state.gameSnapshot, draft => {
        draft.current.draws += change;
      });
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "CHANGE_NUM_PLAYS": {
      const change = action.payload;
      const newSnapshot = produce(state.gameSnapshot, draft => {
        draft.current.plays += change;
      });
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "CHANGE_NUM_ROLLS": {
      const change = action.payload;
      const newSnapshot = produce(state.gameSnapshot, draft => {
        draft.current.draws += change;
      });
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "END_CURRENT_TURN": {
      const { gameSnapshot } = state;
      const newSnapshot = produce(gameSnapshot, draft => {
        draft.current.player = nextPlayer(gameSnapshot)
        draft.current.draws = 1;
        draft.current.plays = 1;
        draft.current.rolls = 1;
      });
      console.log(newSnapshot)
    return {...state, gameSnapshot: newSnapshot}
    }
    default:
      return state;
  }
};

export default stateReducer;
