import { DraggableLocation } from "react-beautiful-dnd";
import { addDragged } from "../helperFunctions/gameSnapshotUpdates/addDragged";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { rearrangeGCZ } from "../helperFunctions/gameSnapshotUpdates/rearrangeGCZ";
import { locate } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { enchant } from "../helperFunctions/gameSnapshotUpdates/enchant";

export interface State {
  gameSnapshot: GameSnapshot;
  transitionData: TransitionData[];
  rearrangingPlaceId: string;
  draggedHandCard: GameCard | undefined;
  highlights: string[];
}

const isGCZ = (source: DraggableLocation, gameSnapshot: GameSnapshot) => locate(source.droppableId, gameSnapshot).place === "GCZ";

const getDraggedHandCard = (state: State, draggableId: string | undefined) =>
  draggableId ? state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

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

      // if (draggedHandCard) {
      //   if (draggedHandCard.action.actionType === "enchant")
      //     // causes dragged BFFs to not appear droppable--
      //     /// --but still actually performs droppable animation...
      //     return { ...state, draggedHandCard: undefined };
      //   else return { ...state, draggedHandCard };
      // }
      return { ...state, draggedHandCard: undefined, highlights: [] };
    // Set rearranging place to "highlighted" to turn off isDropDisabled there
    case "ALLOW_REARRANGING":
      const droppableId = action.payload;
      return { ...state, rearrangingPlaceId: droppableId };
    case "SET_HIGHLIGHTS": {
      const draggableId = action.payload;
      const draggedHandCard = getDraggedHandCard(state, draggableId);
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
      console.log(destination.droppableId)
      return { ...state, gameSnapshot };
    }
    case "ENCHANT":
      // Currently doesn't do anything because logic no longer comes from combine, but 
      // rather from a card being the Droppable and therefore droppableId returns the card Id
      // {
      //   console.log("reducer enchant")
      //   const { source, combine } = action.payload;
      //   console.log("combine", combine)
      //   if (combine) {
      //     console.log(" calling enchant ")
      //     const gameSnapshot = enchant(state.gameSnapshot, source.index, combine.droppableId, combine.draggableId);
      //     return { ...state, gameSnapshot };
      //   }
      // }
      return state;
    case "END_DRAG_CLEANUP":
      return { ...state, draggedHandCard: undefined, rearrangingPlaceId: "", highlights: [] };

    default:
      return state;
  }
};

export default stateReducer;
