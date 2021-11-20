import produce from "immer";
import { locate3 } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";

export interface State {
  gameSnapshot: GameSnapshot;
  GCZRearrangingData: GCZRearrangingData | undefined;
  transitionData: TransitionData[];
  draggedHandCard: GameCard | undefined;
  draggedOverData: DraggedOverData | undefined
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    GCZRearrangingData: undefined,
    transitionData: [],
    draggedHandCard: undefined,
    draggedOverData: undefined
  },
  action: Action
) =>
  produce(state, draft => {
    switch (action.type) {
      case "START_GCZ_REARRANGE":
        draft.GCZRearrangingData = action.payload;
        break;
      case "UPDATE_GCZ_REARRANGING_INDEX":
        if (draft.GCZRearrangingData !== undefined && state.GCZRearrangingData !== undefined) {
          const cardRowShape = state.GCZRearrangingData.cardRowShape;
          const newIndex = action.payload;
          draft.GCZRearrangingData.index = cardRowShape[newIndex];
        }
        break;
      case "END_GCZ_REARRANGE":
        draft.GCZRearrangingData = undefined;
        break;
      case "SET_HAND_CARD_DRAG":
        const draggedCardId = action.payload;
        const handCards = state.gameSnapshot.players[0].places.hand.cards;
        const draggedHandCard = handCards.find(e => e.id === draggedCardId);
        if (draggedHandCard) draft.draggedHandCard = draggedHandCard;
        break;
      case "SET_HAND_CARD_DRAGGED_OVER":
        draft.draggedOverData = action.payload;
        break;
      default:
        return state;
    }
  });

export default stateReducer;
