import createTransitionTemplatesFromChanges from "../animations/findChanges.ts/createTransitionTemplatesFromChanges";
import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
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
  if (newestSnapshot) {
    const changes = findChanges({ prevSnapshot: gameSnapshot, newSnapshot: newestSnapshot });
    const transitionTemplates = createTransitionTemplatesFromChanges(changes, newestSnapshot.snapshotUpdateType);
    const newestSnapshotWithTemplate = { ...newestSnapshot, transitionTemplates } as NewSnapshot;
    const updatedNewSnapshots = [ newestSnapshotWithTemplate, ...newSnapshots ]
    dispatch(setNewGameSnapshots(updatedNewSnapshots))
  }
};

export default addTransitionTemplatesToNewestSnapshot;