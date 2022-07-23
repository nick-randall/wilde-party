import { RootState } from "../redux/store";
import { setAnimationTemplates } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshotNewVersion, setNewSnapshotsNewVersion } from "../redux/updateSnapshotActionCreators";
import createAnimationTemplates from "./createAnimationTemplatesFromSnapshotDifferences";

const handleNewSnapshots = (newSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {

  if (newSnapshots.length === 0) return;

  const { gameSnapshot } = getState();

  dispatch(setNewSnapshotsNewVersion(newSnapshots));
  console.log("this many new snapshots: " + newSnapshots.length)
  console.log(newSnapshots)
  const animationTemplates = createAnimationTemplates(gameSnapshot, newSnapshots[0], "server");

  // If no animations are necessary to show updated state, update game state and deal with the next newsnaphoos...
  if (animationTemplates.length === 0) {
    console.log("no animation templates")
    replaceCurrentSnapshotWithNewSnapshotNewVersion(newSnapshots[0]);
    handleNewSnapshots(getState().newSnapshotsNewVersion);
    return;
  }
  console.log(animationTemplates.length + " animation template groups")
  // Otherwise set up the animation process
  dispatch(setAnimationTemplates(animationTemplates));
};

export default handleNewSnapshots;
