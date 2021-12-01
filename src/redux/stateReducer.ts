import { DraggableLocation, DragUpdate } from "react-beautiful-dnd";
import { addDragged } from "../helperFunctions/gameSnapshotUpdates/addDragged";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameSnapshotUpdates/rearrangeGCZ";
import { locate } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { enchant } from "../helperFunctions/gameSnapshotUpdates/enchant";
import { getLeftOrRightNeighbour } from "../helperFunctions/canEnchantNeighbour";

export interface State {
  gameSnapshot: GameSnapshot;
  transitionData: TransitionData[];
  dragUpdate: UpdateDragData;
  BFFdraggedOverSide: string | undefined;
  rearrangingPlaceId: string;
  draggedHandCard: GameCard | undefined;
  highlights: string[];
  highlightType: string;
}

const isGCZ = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "GCZ";

const getDraggedHandCard = (state: State, draggableId: string | undefined) =>
  draggableId ? state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.action.actionType === "enchantWithBff";

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    dragUpdate: { droppableId: "", index: -1 },
    BFFdraggedOverSide: undefined,
    rearrangingPlaceId: "",
    transitionData: [],
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
  },
  action: Action
) => {
  switch (action.type) {
    // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
    // be altered
    case "SET_DRAGGED_HAND_CARD":
      const draggableId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId);
      return { ...state, draggedHandCard: draggedHandCard };
    // Set rearranging place to "highlighted" to turn off isDropDisabled there
    case "ALLOW_REARRANGING":
      const droppableId = action.payload;
      return { ...state, rearrangingPlaceId: droppableId };
    case "SET_HIGHLIGHTS": {
      const draggableId = action.payload;
      const draggedHandCard = getDraggedHandCard(state, draggableId);
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
        console.log(BFFdraggedOverSide)
        return { ...state, dragUpdate: action.payload, BFFdraggedOverSide };
      }
      return { ...state, dragUpdate: action.payload };
    }
    case "REARRANGE": {
      const { source, destination } = action.payload;
      if (isGCZ(source, state.gameSnapshot)) {
        const gameSnapshot = rearrangeGCZ(state.gameSnapshot, source.index, destination.index);
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
      const { source, destination } = action.payload;
      // here "destination.droppableId" is actually the card that is being enchanted
      if (destination) {
        const gameSnapshot = enchant(state.gameSnapshot, source.index, destination.droppableId);
        return { ...state, gameSnapshot };
      }

      return state;
    case "END_DRAG_CLEANUP":
      return {
        ...state,
        draggedHandCard: undefined,
        rearrangingPlaceId: "",
        highlights: [],
        highlightType: "",
        dragUpdate: { droppableId: "", index: -1 },
        BFFdraggedOverSide: undefined,
      };

    default:
      return state;
  }
};

export default stateReducer;
