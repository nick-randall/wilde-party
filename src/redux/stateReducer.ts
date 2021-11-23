import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
// import { getStartDragAction } from "./startDragFunctions";
// import { onNewGCZRearrange } from "./updateDragActions";

export interface State {
  gameSnapshot: GameSnapshot;
  transitionData: TransitionData[];
  draggedHandCard: GameCard | undefined;
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    //rearrangingData: {placeId: "", index: -1, card: },
    transitionData: [],
    draggedHandCard: undefined,
  },
  action: Action
) => {
  switch (action.type) {
    case "SET_HAND_CARD_DRAG": 
    return {...state, draggedHandCard: action.payload}
   
    default:
      return state;
  }
};

export default stateReducer;
