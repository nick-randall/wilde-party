import produce from "immer";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";

export interface State {
  gameSnapshot: GameSnapshot;
  transitionData: TransitionData[];
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    transitionData: [],
  },
  action: Action
) =>
  produce(state, draft => {
    switch (action.type) {
      default:
        return state;
    }
  });

export default stateReducer;
