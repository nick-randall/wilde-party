import createTransitionTemplates from "../animations/findChanges.ts/createTransitionTemplatesFromChanges";
import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import { addNewGameSnapshots } from "../redux/newSnapshotActions";
import { RootState } from "../redux/store";

export type DraggedCardScreenLocation = { xPosition: number; yPosition: number } | null;

const handleNewSnapshotFromUserAction =
  (newSnapshot: GameSnapshot, snapshotUpdateType: SnapshotUpdateType) =>
  (dispatch: Function, getState: () => RootState) => {
    const { gameSnapshot } = getState();
    const differences = findChanges({ prevSnapshot: gameSnapshot, newSnapshot: newSnapshot });
    const transitionTemplates = createTransitionTemplates(differences, snapshotUpdateType);
    const snapshot = { ...newSnapshot, transitionTemplates, snapshotUpdateType };
    dispatch(addNewGameSnapshots([snapshot]));
  };

export default handleNewSnapshotFromUserAction;
