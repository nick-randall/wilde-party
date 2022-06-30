import { RootState } from "../redux/store";
import { setAnimationTemplates } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshotNewVersion, setNewSnapshotsNewVersion } from "../redux/updateSnapshotActionCreators";
import { findSnapshotDifferences } from "../transitionFunctions/findSnapshotDifferences/findSnapshotDifferences";
import createAnimationTemplatesFromSnapshotDifferencesNewVersion from "./createAnimationTemplatesFromSnapshotDifferencesNewVersion";

const handleNewSnapshots = (newSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {
  if (newSnapshots.length === 0) return;

  const currSnapshot = getState().gameSnapshot;
  dispatch(setNewSnapshotsNewVersion(newSnapshots));
  const animationTemplates = createAnimationTemplates(currSnapshot, newSnapshots[0]);

  if (animationTemplates.length === 0) {
    replaceCurrentSnapshotWithNewSnapshotNewVersion(newSnapshots[0]);
    handleNewSnapshots(getState().newSnapshots);
    return;
  }

  // Handle animation templates

  dispatch(setAnimationTemplates(animationTemplates));
};

//

const createAnimationTemplates = (currSnapshot: GameSnapshot, newSnapshot: GameSnapshot): AnimationTemplateNewVersion[][] => {
  const snapshotDifferences = findSnapshotDifferences(currSnapshot, newSnapshot);
  const animationTemplates = createAnimationTemplatesFromSnapshotDifferencesNewVersion(snapshotDifferences, newSnapshot.snapshotUpdateType, "server");
  return animationTemplates;
};

export default handleNewSnapshots;
