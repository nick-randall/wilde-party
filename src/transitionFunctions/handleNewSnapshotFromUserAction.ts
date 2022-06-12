import createTransitionTemplates from "./createTransitionTemplatesFromSnapshotDifferences";
import { findSnapshotDifferences } from "./findSnapshotDifferences/findSnapshotDifferences";
import { addNewGameSnapshots } from "../redux/newSnapshotActions";
import { RootState } from "../redux/store";
import { setNewGameSnapshots } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshot } from "../redux/updateSnapshotActionCreators";

export type DraggedCardScreenLocation = { xPosition: number; yPosition: number } | null;

const handleNewSnapshotFromUserAction =
  (newSnapshot: GameSnapshot) => (dispatch: Function, getState: () => RootState) => {
    const { gameSnapshot } = getState();
    const {snapshotUpdateType } = newSnapshot
    const differences = findSnapshotDifferences({ prevSnapshot: gameSnapshot, newSnapshot: newSnapshot });
    const transitionTemplates = createTransitionTemplates(differences, snapshotUpdateType, "localUser");
    const snapshot = { ...newSnapshot, transitionTemplates, snapshotUpdateType: snapshotUpdateType };

    // If the snapshot update doesn't involve a transition, 
    // (for example because when adding a card it should aready be 
    // where it is supposed to be), then:
    // Skip all the steps of creating and enacting a transition:
    if (transitionTemplates.length === 0) {
      console.log(" no transition templates")
      dispatch(replaceCurrentSnapshotWithNewSnapshot(snapshot));
    } else {
      dispatch(addNewGameSnapshots([snapshot]));
    }
  };

export default handleNewSnapshotFromUserAction;
