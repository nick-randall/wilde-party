import { RootState } from "../redux/store";
import { removeAnimation, setAnimationTemplates } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshotNewVersion } from "../redux/updateSnapshotActionCreators";
import handleNewSnapshots from "./handleNewSnapshots";

export const changeGroupStatus = (status: AnimationTemplateStatus, array: AnimationTemplateNewVersion[]) =>
  array.map(t => ({ ...t, status: status }));


const handleEndAnimation = (cardId: string) => (dispatch: Function, getState: () => RootState) => {
  const { newSnapshots, animationData } = getState();
  if (animationData.find(a => cardId === a.cardId) === undefined) return;
  dispatch(removeAnimation(cardId));
  
  // Check if more template groups are in the queue...
  const { animationTemplates } = getState();
  if (animationTemplates.length > 1) {
    const newActiveGroup = changeGroupStatus("awaitingEmissaryData", animationTemplates[1]);
    const updatedTemplateGroups = [newActiveGroup, ...animationTemplates.slice(1)];
    dispatch(setAnimationTemplates(updatedTemplateGroups));
    // If not the new Snapshot can be integrated into the game...
  } else {
    dispatch(replaceCurrentSnapshotWithNewSnapshotNewVersion(newSnapshots[0]));
    handleNewSnapshots(getState().newSnapshots);
  }
};

export default handleEndAnimation;
