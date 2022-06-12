import { buildTransitionFromChanges } from "../transitionFunctions/findSnapshotDifferences/buildTransitionFromSnapshotDifferences";
import { DropResult } from "react-beautiful-dnd";
import { RootState } from "../redux/store";
import { endCurrentTurnThunk, shouldEndTurn } from "../redux/thunks";
import { addTransition } from "../redux/transitionQueueActionCreators";

const destroyCardThunk = (dropResult: DropResultEvent) => (dispatch: Function, getState: () => RootState) => {
  const state: RootState = getState();
  const { gameSnapshot } = state;
  const { destination } = dropResult;
  if (destination) {
    const { containerId } = destination;
    dispatch({ type: "DESTROY_CARD", payload: containerId });
    const newSnapshot = getState().gameSnapshot;
    const newTransition = buildTransitionFromChanges({ prevSnapshot: gameSnapshot, newSnapshot: newSnapshot }, "drawCard", 0, state);
    console.log(newTransition);
    dispatch(addTransition(newTransition));
    dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
    if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk());
  }
};

export default destroyCardThunk;
