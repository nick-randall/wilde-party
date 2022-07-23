import { findSnapshotDifferences } from "../transitionFunctions/findSnapshotDifferences/findSnapshotDifferences";
import { addNewGameSnapshots } from "../redux/newSnapshotActions";
import { RootState } from "../redux/store";
import { setNewGameSnapshots } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshot, replaceCurrentSnapshotWithNewSnapshotNewVersion } from "../redux/updateSnapshotActionCreators";
import createAnimationTemplatesFromSnapshotDifferencesNewVersion from "../animations/createAnimationTemplatesFromSnapshotDifferences";

export type DraggedCardScreenLocation = { xPosition: number; yPosition: number } | null;

const handleNewSnapshotFromUserAction =
  (newSnapshot: GameSnapshot) => (dispatch: Function, getState: () => RootState) => {
    const { gameSnapshot } = getState();
    const {snapshotUpdateType } = newSnapshot
    const animationTemplates = createAnimationTemplatesFromSnapshotDifferencesNewVersion(gameSnapshot, newSnapshot, "localUser");
    const snapshot: GameSnapshot = { ...newSnapshot,  snapshotUpdateType: snapshotUpdateType };
    // If the snapshot update doesn't involve a transition, 
    // (for example because when adding a card it should aready be 
    // where it is supposed to be), then:
    // Skip all the steps of creating and enacting a transition:
    if (animationTemplates.length === 0) {
      console.log(" no transition templates")
      dispatch(replaceCurrentSnapshotWithNewSnapshotNewVersion(snapshot));
    } else {
      console.log("just adding new game snapshots")
      dispatch(addNewGameSnapshots([snapshot]));
      console.log(getState().newSnapshotsNewVersion)
    }
  };

export default handleNewSnapshotFromUserAction;
