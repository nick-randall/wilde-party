import { findSnapshotDifferences } from "./findSnapshotDifferences/findSnapshotDifferences";
import { RootState } from "../redux/store";
import { setNewGameSnapshots } from "../redux/transitionQueueActionCreators";
import createTransitionTemplatesFromSnapshotDifferences from "./createTransitionTemplatesFromSnapshotDifferences";
import { replaceCurrentSnapshotWithNewSnapshot } from "../redux/updateSnapshotActionCreators";

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

    const transitionTemplates = createTransitionTemplatesFromSnapshotDifferences(differences, newestSnapshot.snapshotUpdateType, "server");
    if (transitionTemplates.length === 0) {
      console.log(" no transition templates in newest snapshot from server");
      console.log("--replacing current snapshot without any transitions.")
      dispatch(replaceCurrentSnapshotWithNewSnapshot(newestSnapshot));
    } else {
      // The first in queue templates will have a status of "awaitingEmissaryData"
      const newestSnapshotWithTemplate = { ...newestSnapshot, transitionTemplates } as NewSnapshot;
      const updatedNewSnapshots = [newestSnapshotWithTemplate, ...newSnapshots];
      console.log("received new snapshot with these transition templates:" )
      console.log(newestSnapshotWithTemplate.transitionTemplates)

      dispatch(setNewGameSnapshots(updatedNewSnapshots));
    }
  }

  //TODO: if no transitions to be created, just go straight to replacing currentsnapshot with new
};

export default addTransitionTemplatesToNewestSnapshot;
