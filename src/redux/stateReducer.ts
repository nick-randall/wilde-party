import { DraggableLocation } from "react-beautiful-dnd";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameSnapshotUpdates/rearrangeGCZ";
import { locate, locatePlace } from "../helperFunctions/locateFunctions";
import { Action } from "./actions";
import { enchant } from "../helperFunctions/gameSnapshotUpdates/enchant";
import { getLeftOrRightNeighbour } from "../helperFunctions/canEnchantNeighbour";
import { rearrangeSpecialsZone } from "../helperFunctions/gameSnapshotUpdates/rearrangeSpecialsZone";
import { drawCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/drawCard";
import { produce } from "immer";
import { dealStartingGuestUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/dealStartingGuest";
import { initialGameSnapshot } from "../initialCards";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

export interface State {
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

const isGCZ = (placeId: number, gameSnapshot: GameSnapshot) => locatePlace(placeId, gameSnapshot).placeType === "GCZ";

const isSpecialsZone = (type: DroppableEntityType, placeId: number, gameSnapshot: GameSnapshot) => {
  if (type !== "place") return false;
  return locatePlace(placeId, gameSnapshot).placeType === "specialsZone";
};

const isSpecialsColumn = (type: DroppableEntityType, id: number, gameSnapshot: GameSnapshot) => {
  if (type !== "cardGroup") return false;
  return locate(id, gameSnapshot).place === "specialsZone";
};

const getDraggedHandCard = (state: State, draggableId: number | undefined) =>
  draggableId ? state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.action.actionType === "enchantWithBff";

//const phaseNormalTurnIsYours = (gameSnapshot: GameSnapshot) => gameSnapshot.current.player === 0 && gameSnapshot.current.phase === "normalPhase";

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    screenSize: getScreenSize(),
    draggedOver: undefined,
    BFFdraggedOverSide: undefined,
    transitionData: [],
    rearrangingData: { placeId: -1, draggedId: -1, sourceIndex: -1 },
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
    // aiPlaying: "",
  },
  action: Action
) => {
  switch (action.type) {
    case "SET_SCREEN_SIZE": {
      return { ...state, screenSize: getScreenSize() };
    }
    // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
    // be altered
    case "SET_DRAGGED_HAND_CARD": {
      const draggableId = action.payload;
      if (!draggableId) return { ...state, draggedHandCard: undefined };
      const { id } = JSON.parse(draggableId);
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === id);
      return { ...state, draggedHandCard: draggedHandCard };
    }
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
    case "UPDATE_DRAGGED_OVER": {
      if (action.payload === undefined) {
        return { ...state, draggedOver: undefined };
      }
      const { id, index, type } = action.payload;

      if (isEnchantWithBFF(state.draggedHandCard)) {
        const BFFdraggedOverSide = getLeftOrRightNeighbour(state.gameSnapshot, id);
        return { ...state, draggedOver: action.payload, BFFdraggedOverSide };
      }
      if (isSpecialsColumn(type, id, state.gameSnapshot)) {
        console.log(`Dragged over specials column at calculated index: ${index}`);
        /// TODO not sure why we set it to 0 here
        const draggedOver: DraggedOverData =  { ...action.payload, index: 0 }
        return { ...state, draggedOver };
      }
      return { ...state, draggedOver: action.payload };
    }
    case "REARRANGE": {
      const { source, destination } = action.payload;
      if (isGCZ(source.id, state.gameSnapshot)) {
        const gameSnapshot = rearrangeGCZ(state.gameSnapshot, source.index, destination.index);
        return { ...state, gameSnapshot };
      } else if (isSpecialsZone(source.type, source.id, state.gameSnapshot)) {
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
    // case "ADD_DRAGGED": {
    //   const { source, destination } = action.payload;
    //   // const { droppableId } = destination;
    //   // if (isSpecialsColumn(droppableId, state.gameSnapshot)) {
    //   //   const gameSnapshot = addDraggedUpdateSnapshot(state.gameSnapshot, source.droppableId, source.index, destination.droppableId.slice(1), destination.index);

    //   //   return { ...state, gameSnapshot };
    //   // }

    //   const gameSnapshot = addDraggedUpdateSnapshot(state.gameSnapshot, source.droppableId, source.index, destination.droppableId, destination.index);
    //   console.log("finished adding dragged");
    //   return { ...state, gameSnapshot };
    // }
    // case "ENCHANT":
    //   // Here "destination.droppableId" is actually the card that is being enchanted.
    //   const { source, destination } = action.payload;
    //   console.log(locate(source.droppableId, state.gameSnapshot), locate(destination.droppableId, state.gameSnapshot));
    //   if (destination) {
    //     const gameSnapshot = enchant(state.gameSnapshot, source.index, destination.droppableId);
    //     return { ...state, gameSnapshot };
    //   } else return state;
    // case "DESTROY_CARD": {
    //   const targetCardId = action.payload;
    //   console.log("destroy card", targetCardId);

    //   const gameSnapshot = destroyCardUpdateSnapshot(targetCardId, state.gameSnapshot);

    //   return { ...state, gameSnapshot };
    // }
    case "DRAW_CARD":
      if (state.gameSnapshot.nonPlayerPlaces.deck.cards.length === 0) return state;
      const { player, handId } = action.payload;
      const gameSnapshot = drawCardUpdateSnapshot(handId, player, state.gameSnapshot);
      return { ...state, gameSnapshot };

    // return { ...state, gameSnapshot, transitionData: [...state.transitionData, newTransition] };
    case "END_DRAG_CLEANUP":
      const rearrangingData:SimpleRearrangingData = { placeId: -1, draggedId: -1, sourceIndex: -1 };
      return {
        ...state,
        draggedHandCard: undefined,
        highlights: [],
        highlightType: "",
        draggedOver: undefined,
        BFFdraggedOverSide: undefined,
        rearrangingData,
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
    // case "SET_AI_PLAYING": {
    //   console.log("setting playing", action.payload);
    //   return { ...state, aiPlaying: action.payload };
    // }
    default:
      return state;
  }
};

export default stateReducer;
