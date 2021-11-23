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
    case "SET_HAND_CARD_DRAG":
      const draggableId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId)
      console.log(draggedHandCard)
      if (draggedHandCard) {
        const highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        return { ...state, draggedHandCard, highlights};
        //return {...state, draggedHandCard}
      }
      return state;
    default:
      return state;
  }
};

export default stateReducer;
