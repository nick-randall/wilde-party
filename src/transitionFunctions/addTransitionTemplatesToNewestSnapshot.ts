import createTransitionTemplatesFromChanges from "./createTransitionTemplatesFromSnapshotDifferences";
import { findSnapshotDifferences } from "./findSnapshotDifferences/findSnapshotDifferences";
import { RootState } from "../redux/store";
import { setNewGameSnapshots } from "../redux/transitionQueueActionCreators";

/**
 * This function should be called after a different newSnapshot lands
 * at the top of the queue. For example: after incoming snapshots have been added. 
 * @returns 
 */
const addTransitionTemplatesToNewestSnapshot = () => (dispatch: Function, getState: () => RootState) => {
  const { gameSnapshot, newSnapshots } = getState();
  // Newest Snapshot should already be the first in the array
  const newestSnapshot = newSnapshots.shift();
  if (newestSnapshot !== undefined) {
    const differences = findSnapshotDifferences({ prevSnapshot: gameSnapshot, newSnapshot: newestSnapshot });
    const transitionTemplates = createTransitionTemplatesFromChanges(differences, newestSnapshot.snapshotUpdateType, "server");
    const newestSnapshotWithTemplate = { ...newestSnapshot, transitionTemplates } as NewSnapshot;
    const updatedNewSnapshots = [ newestSnapshotWithTemplate, ...newSnapshots ]
    console.log("new snapshot to be set", updatedNewSnapshots)

    dispatch(setNewGameSnapshots(updatedNewSnapshots))
  }

  //TODO: if no transitions to be created, just go straight to replacing currentsnapshot with new
};

export default addTransitionTemplatesToNewestSnapshot;
