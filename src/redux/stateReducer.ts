import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { initialGameSnapshot } from "../initialCards";
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
    case "SET_DRAGGED_HAND_CARD":
      const draggableId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId);
      if (draggedHandCard) {
        return { ...state, draggedHandCard };
      }
      return { ...state, draggedHandCard: undefined, highlights: [] };
    case "SET_HIGHLIGHTS":
      const draggableId2 = action.payload;
      const draggedHandCard2 = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId2);
      if (draggedHandCard2) {
        const highlights = getHighlights(draggedHandCard2, state.gameSnapshot);
        console.log(highlights)
        return { ...state, highlights };
      } else return state;

    default:
      return state;
  }
};

export default stateReducer;
