import { RootState } from "../../redux/store";
import { setNewGameSnapshots } from "../../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshot } from "../../redux/updateSnapshotActionCreators";
import { findSnapshotDifferences } from "../../transitionFunctions/findSnapshotDifferences/findSnapshotDifferences";
import createAnimationTemplatesFromSnapshotDifferences from "./createAnimationTemplatesFromSnapshotDifferences";

/**
 * This function should be called after a different newSnapshot lands
 * at the top of the queue. For example: after incoming snapshots have been added.
 * @returns
 */
const addAnimationTemplatesToNewestSnapshots = () => (dispatch: Function, getState: () => RootState) => {
  const { gameSnapshot, newSnapshots } = getState();
  // Newest Snapshot should already be the first in the array
  console.log(newSnapshots)
  const newestSnapshot = newSnapshots.shift();
  if (newestSnapshot !== undefined) {
    console.log(newestSnapshot) 
    const differences = findSnapshotDifferences(gameSnapshot, newestSnapshot);
    console.log(differences)

    const animationTemplates = createAnimationTemplatesFromSnapshotDifferences(differences, newestSnapshot.snapshotUpdateType, "server");
    if (animationTemplates.length === 0) {
      console.log(" no transition templates in newest snapshot from server");
      console.log("--replacing current snapshot without any transitions.")
      dispatch(replaceCurrentSnapshotWithNewSnapshot(newestSnapshot));
    } else {
      // The first in queue templates will have a status of "awaitingEmissaryData"
      const newestSnapshotWithTemplate = { ...newestSnapshot, animationTemplates } as NewSnapshot;
      const updatedNewSnapshots = [newestSnapshotWithTemplate, ...newSnapshots];
      console.log("received new snapshot with these transition templates:" )
      console.log(newestSnapshotWithTemplate.animationTemplates)

      dispatch(setNewGameSnapshots(updatedNewSnapshots));
    }
  }

  //TODO: if no transitions to be created, just go straight to replacing currentsnapshot with new
};

export default addAnimationTemplatesToNewestSnapshots;
