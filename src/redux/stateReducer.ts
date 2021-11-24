import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { convertedSnapshot, initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";

export interface State {
  gameSnapshot: GameSnapshot;
  transitionData: TransitionData[];
  draggedHandCard: GameCard | undefined;
  highlights: string[];
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    //rearrangingData: {placeId: "", index: -1, card: },
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
      if (draggedHandCard) {
        return { ...state, draggedHandCard };
      }
      return { ...state, draggedHandCard: undefined, highlights: [] };
    // Set rearranging place to "highlighted" to turn off isDropDisabled there
    case "ALLOW_REARRANGING" :
      const droppableId = action.payload;
      return {...state, highlights: [droppableId]}
    case "SET_HIGHLIGHTS":
      const draggableId2 = action.payload;
      const draggedHandCard2 = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId2);
      if (draggedHandCard2) {
        const highlights = getHighlights(draggedHandCard2, state.gameSnapshot);
        console.log(highlights)
        return { ...state, highlights };
      } else return state;
      // case "REARRANGE":
      // const { source, destination } = action.payload;
      

    default:  
      return state;
  }
};

export default stateReducer;
