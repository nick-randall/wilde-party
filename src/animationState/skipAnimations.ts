import { setSnapshotIndex } from "../gameSnapshotState/gameSnapshotSlice";
import { RootState } from "../redux/store";
import { setActiveAnimation } from "./animationState";

export const skipToEndOfAnimations = () => (dispatch: Function, getState: () => RootState) => {
    const numSnapshots = getState().gameSnapshotState.snapshots.length;
    dispatch(setSnapshotIndex(numSnapshots - 1));
    dispatch(setActiveAnimation(undefined));
    dispatch({ type: "CANCEL_ANIMATION_TIMER" });
};
