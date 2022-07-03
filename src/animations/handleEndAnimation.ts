import { RootState } from "../redux/store";
import { clearAnimationTemplates, removeAnimation } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshotNewVersion } from "../redux/updateSnapshotActionCreators";
import handleNewSnapshots from "./handleNewSnapshots";

export const changeGroupStatus = (status: AnimationTemplateStatus, array: AnimationTemplateNewVersion[]) =>
  array.map(t => ({ ...t, status: status }));

export const removeFirstElement = (array: any[]) => array.slice(1);

const handleEndAnimation = (cardId: string) => (dispatch: Function, getState: () => RootState) => {
  const { newSnapshotsNewVersion, animationData } = getState();
  if (animationData.find(a => cardId === a.cardId) === undefined) return;
  // This also removes the corresponding animationTemplate from the queue
  dispatch(removeAnimation(cardId));

  const isEveryTemplateComplete = getState()
    .animationTemplates.flat()
    .every(a => a.status === "complete");
  if (isEveryTemplateComplete && newSnapshotsNewVersion.length > 0) {
    dispatch(clearAnimationTemplates());
    dispatch(replaceCurrentSnapshotWithNewSnapshotNewVersion(newSnapshotsNewVersion[0]));
    console.log("now new snapshots lenght = " + newSnapshotsNewVersion.length);
    handleNewSnapshots(getState().newSnapshotsNewVersion);
  }
};

export default handleEndAnimation;
