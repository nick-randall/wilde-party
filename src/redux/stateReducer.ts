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
import { dealStartingGuestUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/dealStartingGuest";
import { destroyCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/destroy";
import { DraggedState } from "../dndcomponents/stateReducer";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

export interface State {
  gameSnapshot: GameSnapshot;
  draggedState: DraggedState;
  draggedId?: string;
  dragContainerExpand: { width: number; height: number };
  screenSize: { width: number; height: number };
  transitionData: TransitionData[];
  dragUpdate: UpdateDragData;
  BFFdraggedOverSide: string | undefined;
  rearrangingData: SimpleRearrangingData;
  draggedHandCard: GameCard | undefined;
  highlights: string[];
  highlightType: string;
  aiPlaying: string;
}

const isGCZ = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "GCZ";

const isSpecialsZone = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "specialsZone";

const isSpecialsColumn = (droppableId: string, gameSnapshot: GameSnapshot) => locate(droppableId.slice(1), gameSnapshot).place === "specialsZone";

const getDraggedHandCard = (state: State, draggableId: string | undefined) =>
  draggableId ? state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.action.actionType === "enchantWithBff";

//const phaseNormalTurnIsYours = (gameSnapshot: GameSnapshot) => gameSnapshot.current.player === 0 && gameSnapshot.current.phase === "normalPhase";

const initialDragState = {
  draggedId: undefined,
  draggedState: { source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
};

export const stateReducer = (
  state: State = {
    gameSnapshot: createGameSnapshot(),
    screenSize: getScreenSize(),
    draggedId: initialDragState.draggedId,
    dragContainerExpand: initialDragState.dragContainerExpand,
    draggedState: initialDragState.draggedState,
    dragUpdate: { droppableId: "", index: -1 },
    BFFdraggedOverSide: undefined,
    transitionData: [],
    rearrangingData: { placeId: "", draggableId: "", sourceIndex: -1 },
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
    aiPlaying: "",
  },
  action: Action
) => {
  switch (action.type) {
    case "SET_SCREEN_SIZE":
      return { ...state, screenSize: getScreenSize() };
    // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
    // be altered
    case "SET_DRAGGED_ID":
      return { ...state, draggedId: action.payload };
    case "SET_INITIAL_DRAGGED_STATE": {
      return { ...state, draggedState: { source: action.payload, destination: action.payload, isInitialRearrange: true } };
    }
    case "UPDATE_DRAG_DESTINATION":
      const { destination } = action.payload;
      return { ...state, draggedState: { ...state.draggedState, destination: destination, isInitialRearrange: false } };
    case "CLEAN_UP_DRAG_STATE":
      return {
        ...state,
        draggedState: initialDragState.draggedState,
        draggedId: initialDragState.draggedId,
        dragContainerExpand: initialDragState.dragContainerExpand,
      };
    case "SET_DRAG_CONTAINER_EXPAND":
      return { ...state, dragContainerExpand: action.payload };

    case "SET_DRAGGED_HAND_CARD":
      const draggableId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId);
      return { ...state, draggedHandCard: draggedHandCard };
    case "START_REARRANGING": {
      return { ...state, rearrangingData: action.payload };
    }
    case "SET_HIGHLIGHTS": {
      // if(!phaseNormalTurnIsYours) return state;
      const draggedHandCard = state.draggedHandCard; //getDraggedHandCard(state, draggableId);
      if (draggedHandCard) {
        const highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        console.log(highlights);
        const highlightType = draggedHandCard.action.highlightType;
        return { ...state, highlights, highlightType };
      } else return state;
    }
    case "UPDATE_DRAG": {
      const { index, droppableId } = action.payload;
      if (isEnchantWithBFF(state.draggedHandCard)) {
        const { droppableId } = action.payload;
        const BFFdraggedOverSide = getLeftOrRightNeighbour(state.gameSnapshot, droppableId);
        return { ...state, dragUpdate: action.payload, BFFdraggedOverSide };
      }
      if (isSpecialsColumn(droppableId, state.gameSnapshot)) {
        console.log(droppableId.slice(1));
        return { ...state, dragUpdate: { droppableId: droppableId, index: 0 } };
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
    case "DEAL_STARTING_GUEST": {
      console.log("deal starting guest");
      const player = action.payload;
      const gameSnapshot = dealStartingGuestUpdateSnapshot(player, state.gameSnapshot);
      return { ...state, gameSnapshot };
    }
    case "ADD_DRAGGED": {
      const { source, destination } = action.payload;
      // const { droppableId } = destination;
      // if (isSpecialsColumn(droppableId, state.gameSnapshot)) {
      //   const gameSnapshot = addDraggedUpdateSnapshot(state.gameSnapshot, source.droppableId, source.index, destination.droppableId.slice(1), destination.index);

      //   return { ...state, gameSnapshot };
      // }

      const gameSnapshot = addDraggedUpdateSnapshot(state.gameSnapshot, source.droppableId, source.index, destination.droppableId, destination.index);
      console.log("finished adding dragged");
      return { ...state, gameSnapshot };
    }
    // case "ENCHANT":
    //   // Here "destination.droppableId" is actually the card that is being enchanted.
    //   const { source, destination } = action.payload;
    //   console.log(locate(source.droppableId, state.gameSnapshot), locate(destination.droppableId, state.gameSnapshot));
    //   if (destination) {
    //     const gameSnapshot = enchant(state.gameSnapshot, source.index, destination.droppableId);
    //     return { ...state, gameSnapshot };
    //   } else return state;
    case "DESTROY_CARD": {
      const targetCardId = action.payload;
      console.log("destroy card", targetCardId);

      const gameSnapshot = destroyCardUpdateSnapshot(targetCardId, state.gameSnapshot);

      return { ...state, gameSnapshot };
    }
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
    case "END_CURRENT_PHASE":
      // currently only ends the deal phase
      const phases: Phase[] = ["dealPhase", "playPhase", "drawPhase", "rollPhase", "counterPhase"];
      const newSnapshot = produce(state.gameSnapshot, draft => {
        switch (state.gameSnapshot.current.phase) {
          case "dealPhase":
            draft.current.phase = "drawPhase";
            break;
          case "drawPhase":
            draft.current.phase = "playPhase";
            break;
          default:
            draft.current.phase = "playPhase";
        }
      });
      console.log("here");
      return { ...state, gameSnapshot: newSnapshot };
    case "END_CURRENT_TURN": {
      const { gameSnapshot } = state;
      const newSnapshot = produce(gameSnapshot, draft => {
        draft.current.player = nextPlayer(gameSnapshot);
        draft.current.draws = 1;
        draft.current.plays = 1;
        draft.current.rolls = 1;
        draft.current.phase = "drawPhase";
      });
      console.log(newSnapshot);
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "SET_AI_PLAYING": {
      console.log("setting playing", action.payload);
      return { ...state, aiPlaying: action.payload };
    }
    default:
      return state;
  }
};

export default stateReducer;
