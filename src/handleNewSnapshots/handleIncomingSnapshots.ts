import { addNewGameSnapshots } from "../redux/newSnapshotActions";
import { RootState } from "../redux/store";
import addAnimationTemplatesToNewestSnapshot from "../thunks/animationFunctions/addAnimationTemplatesToNewestSnapshot";
import addTransitionTemplatesToNewestSnapshot from "../transitionFunctions/addTransitionTemplatesToNewestSnapshot";


/**
 * Converts the snapshots to type NewSnapshot
 * sorts them in the correct order
 *
 * @param incomingNewSnapshots new Snapshots from the server
 * @returns
 */
const handleIncomingSnapshots = (incomingNewSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {
  const incomingSnapshotsWereFirstInStack = getState().newSnapshots.length === 0;
  // Convert snapshots to type NewSnapshot, adding transitionTemplates
  let newSnapshotsAsNewSnapshots: NewSnapshot[] = incomingNewSnapshots.map(e => ({ ...e, animationTemplates: [] }));
  let sortedNewSnapshots = newSnapshotsAsNewSnapshots.sort((a, b) => a.id - b.id);
  dispatch(addNewGameSnapshots(sortedNewSnapshots));
  if (incomingSnapshotsWereFirstInStack) {
    // Create transitionTemplates from the newestSnapshot
    // dispatch(addTransitionTemplatesToNewestSnapshot());
    dispatch(addAnimationTemplatesToNewestSnapshot());


  }
};

export default handleIncomingSnapshots;