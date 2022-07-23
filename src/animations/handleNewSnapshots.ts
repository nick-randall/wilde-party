import { RootState } from "../redux/store";
import { setAnimationTemplates } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshot, setNewSnapshots } from "../redux/updateSnapshotActionCreators";
import createAnimationTemplates from "./createAnimationTemplatesFromSnapshotDifferences";

const handleNewSnapshots = (newSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {

  if (newSnapshots.length === 0) return;

  const { gameSnapshot } = getState();

  dispatch(setNewSnapshots(newSnapshots));
  console.log("this many new snapshots: " + newSnapshots.length)
  console.log(newSnapshots)
  const animationTemplates = createAnimationTemplates(gameSnapshot, newSnapshots[0], "server");

  // If no animations are necessary to show updated state, update game state and deal with the next newsnaphoos...
  if (animationTemplates.length === 0) {
    console.log("no animation templates")
    replaceCurrentSnapshotWithNewSnapshot(newSnapshots[0]);
    handleNewSnapshots(getState().newSnapshots);
    return;
  }
  console.log(animationTemplates.length + " animation template groups")
  // Otherwise set up the animation process
  dispatch(setAnimationTemplates(animationTemplates));
};

export default handleNewSnapshots;
