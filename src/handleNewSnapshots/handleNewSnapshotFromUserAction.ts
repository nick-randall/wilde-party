import createTransitionTemplates from "../transitionFunctions/createTransitionTemplatesFromSnapshotDifferences";
import { findSnapshotDifferences } from "../transitionFunctions/findSnapshotDifferences/findSnapshotDifferences";
import { addNewGameSnapshots } from "../redux/newSnapshotActions";
import { RootState } from "../redux/store";
import { setNewGameSnapshots } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshot } from "../redux/updateSnapshotActionCreators";
import createAnimationTemplatesFromSnapshotDifferences from "../thunks/animationFunctions/createAnimationTemplatesFromSnapshotDifferences";

export type DraggedCardScreenLocation = { xPosition: number; yPosition: number } | null;

const handleNewSnapshotFromUserAction =
  (newSnapshot: GameSnapshot) => (dispatch: Function, getState: () => RootState) => {
    const { gameSnapshot } = getState();
    const {snapshotUpdateType } = newSnapshot
    const differences = findSnapshotDifferences( gameSnapshot, newSnapshot );
    const animationTemplates = createAnimationTemplatesFromSnapshotDifferences(differences, snapshotUpdateType, "localUser");
    const snapshot = { ...newSnapshot, animationTemplates, snapshotUpdateType: snapshotUpdateType };

    // If the snapshot update doesn't involve a transition, 
    // (for example because when adding a card it should aready be 
    // where it is supposed to be), then:
    // Skip all the steps of creating and enacting a transition:
    if (animationTemplates.length === 0) {
      console.log(" no transition templates")
      dispatch(replaceCurrentSnapshotWithNewSnapshot(snapshot));
    } else {
      dispatch(addNewGameSnapshots([snapshot]));
    }
  };

export default handleNewSnapshotFromUserAction;
