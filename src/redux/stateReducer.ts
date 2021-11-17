import produce from "immer";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";

export interface State {
  gameSnapshot: GameSnapshot;
  GCZRearrangingData: GCZRearrangingData | undefined;
  transitionData: TransitionData[];
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    GCZRearrangingData: undefined,
    transitionData: [],
  },
  action: Action
) =>
  produce(state, draft => {
    switch (action.type) {
      case "START_GCZ_REARRANGE" : 
        draft.GCZRearrangingData = action.payload
        console.log("here") 
      break;
      default:
        return state;
    }
  });

export default stateReducer;
