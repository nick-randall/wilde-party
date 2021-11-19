import produce from "immer";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";

export interface State {
  gameSnapshot: GameSnapshot;
  GCZRearrangingData: GCZRearrangingData | undefined;
  transitionData: TransitionData[];
  draggedHandCard: string | undefined;
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    GCZRearrangingData: undefined,
    transitionData: [],
    draggedHandCard: undefined
  },
  action: Action
) =>
  produce(state, draft => {
    switch (action.type) {
      case "START_GCZ_REARRANGE":
        draft.GCZRearrangingData = action.payload;
        break;
      case "UPDATE_GCZ_REARRANGING_INDEX":
        console.log("up");
        if (draft.GCZRearrangingData !== undefined && state.GCZRearrangingData !== undefined) {
          const cardRowShape = state.GCZRearrangingData.cardRowShape;
          const newIndex = action.payload;
          draft.GCZRearrangingData.index = cardRowShape[newIndex];
        }
        break;
        case "END_GCZ_REARRANGE":
          draft.GCZRearrangingData = undefined;
          break;
        case "SET_HAND_CARD_DRAG" :
          console.log("setting draggedhand card to " + action.payload)
          draft.draggedHandCard = action.payload;
          break;
      default:
        return state;
    }
  });

export default stateReducer;
