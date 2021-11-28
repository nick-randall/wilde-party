import { DraggableLocation } from "react-beautiful-dnd";
import { addDragged } from "../helperFunctions/gameRules/addDragged";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameRules/rearrangeGCZ";
import { locate } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";

export interface State {
  gameSnapshot: GameSnapshot;
  transitionData: TransitionData[];
  rearrangingPlaceId: string;
  draggedHandCard: GameCard | undefined;
  highlights: string[];
}

const isGCZ = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "GCZ";

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    rearrangingPlaceId: "",
    transitionData: [],
    draggedHandCard: undefined,
    highlights: [],
  },
  action: Action
) => {
  switch (action.type) {
    // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
    // be altered
    case "SET_DRAGGED_HAND_CARD":
      const draggableId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId);

      // TODO: Improve readability

      if (draggedHandCard) {
        if (draggedHandCard.action.actionType === "enchant")
          // causes dragged BFFs to not appear droppable--
          /// --but still actually performs droppable animation...
          return { ...state, draggedHandCard: undefined };
        else return { ...state, draggedHandCard };
      }
      return { ...state, draggedHandCard: undefined, highlights: [] };
    // Set rearranging place to "highlighted" to turn off isDropDisabled there
    case "ALLOW_REARRANGING":
      const droppableId = action.payload;
      return { ...state, rearrangingPlaceId: droppableId };
    case "SET_HIGHLIGHTS": {
      const draggableId2 = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId2);
      if (draggedHandCard) {
        const highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        return { ...state, highlights };
      } else return state;
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
      return { ...state, gameSnapshot };
    }
    case "END_DRAG_CLEANUP":
      return { ...state, draggedHandCard: undefined, rearrangingPlaceId: "", highlights: [] };

    default:
      return state;
  }
};

export default stateReducer;
