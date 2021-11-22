import produce from "immer";
import { locate3 } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { getStartDragAction } from "./startDragFunctions";
import getUpdateDragAction from "./updateDragActions";

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
) =>{
 
switch (action.type) {
  case "START_DRAG":
    let stateCopy = { ...state };
    const startDragAction = getStartDragAction(state, action);
    stateCopy = startDragAction(state, action.payload);
    console.log(stateCopy.GCZRearrangingData)
    return stateCopy;

  case "UPDATE_DRAG":
    const updateDragAction = getUpdateDragAction(state, action);
    console.log(state.GCZRearrangingData)
    let stateCopy2 = { ...state };
    stateCopy2 = updateDragAction(state, action.payload);

    return stateCopy2;

  //  case "END_DRAG" :
  //  const
  default:
    return state;
}
};

export default stateReducer;
