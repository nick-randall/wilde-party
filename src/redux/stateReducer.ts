import { DraggableLocation, DragUpdate } from "react-beautiful-dnd";
import { addDragged } from "../helperFunctions/gameSnapshotUpdates/addDragged";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameSnapshotUpdates/rearrangeGCZ";
import { locate } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { enchant } from "../helperFunctions/gameSnapshotUpdates/enchant";
import { getLeftOrRightNeighbour } from "../helperFunctions/canEnchantNeighbour";
import { rearrangeSpecialsZone } from "../helperFunctions/gameSnapshotUpdates/rearrangeSpecialsZone";
import { buildTransition } from "../dimensions/buildTransition";
import { drawCard } from "../helperFunctions/gameSnapshotUpdates/drawCard";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

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
  test: { x: number; y: number };
}

const isGCZ = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "GCZ";

const isSpecialsZone = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "specialsZone";

const getDraggedHandCard = (state: State, draggableId: string | undefined) =>
  draggableId ? state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.action.actionType === "enchantWithBff";

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    screenSize: getScreenSize(),
    dragUpdate: { droppableId: "", index: -1 },
    BFFdraggedOverSide: undefined,
    transitionData: [],
    rearrangingData: { placeId: "", draggableId: "", sourceIndex: -1 },
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
    test: { x: 0, y: 0 },
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
      }
      return { ...state, dragUpdate: action.payload };
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
      const gameSnapshot = addDragged(state.gameSnapshot, source.index, destination.droppableId, destination.index);
      console.log("ADDED DRAGGED");
      return { ...state, gameSnapshot };
    }
    case "ENCHANT":
      // Here "destination.droppableId" is actually the card that is being enchanted.
      const { source, destination } = action.payload;
      if (destination) {
        const gameSnapshot = enchant(state.gameSnapshot, source.index, destination.droppableId);
        return { ...state, gameSnapshot };
      }

      return state;
    case "DRAW_CARD":
      if (state.gameSnapshot.nonPlayerPlaces.deck.cards.length === 0) return state;
      const deckId = action.payload;
      const originIndex = 0;
      const handId = state.gameSnapshot.players[0].places.hand.id;
      const cardId = state.gameSnapshot.nonPlayerPlaces["deck"].cards[0].id;
      const handIndex = 0;
      const transitionType = "drawCard";
      const newTransition = buildTransition(cardId, transitionType, deckId, originIndex, handId, handIndex, state.screenSize, state.gameSnapshot);
      const gameSnapshot = drawCard(state.gameSnapshot)
      // state.transitionData[0]. =
      console.log(newTransition);

      return { ...state, gameSnapshot, transitionData: [...state.transitionData, newTransition] };
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

    default:
      return state;
  }
};

export default stateReducer;
