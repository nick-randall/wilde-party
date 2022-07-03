import { RootState } from "../redux/store";
import { setAnimationTemplates } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshotNewVersion, setNewSnapshotsNewVersion } from "../redux/updateSnapshotActionCreators";
import createAnimationTemplates from "./createAnimationTemplatesFromSnapshotDifferencesNewVersion";

const handleNewSnapshots = (newSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {

  if (newSnapshots.length === 0) return;

  const { gameSnapshot } = getState();

  dispatch(setNewSnapshotsNewVersion(newSnapshots));
  const animationTemplates = createAnimationTemplates(gameSnapshot, newSnapshots[0]);

  // If no animations are necessary to show updated state, update game state and deal with the next newsnaphoos...
  if (animationTemplates.length === 0) {
    console.log("no animation templates")
    replaceCurrentSnapshotWithNewSnapshotNewVersion(newSnapshots[0]);
    handleNewSnapshots(getState().newSnapshots);
    return;
  }
  console.log(animationTemplates.length + " animation templates")
  // Otherwise set up the animation process
  dispatch(setAnimationTemplates(animationTemplates));
};

export default handleNewSnapshots;