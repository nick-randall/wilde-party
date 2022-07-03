import { RootState } from "../redux/store";
import { removeAnimation } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshotNewVersion } from "../redux/updateSnapshotActionCreators";
import handleNewSnapshots from "./handleNewSnapshots";

export const changeGroupStatus = (status: AnimationTemplateStatus, array: AnimationTemplateNewVersion[]) =>
  array.map(t => ({ ...t, status: status }));

export const removeFirstElement = (array: any[]) => array.slice(1);

const handleEndAnimation = (cardId: string) => (dispatch: Function, getState: () => RootState) => {
  const { newSnapshotsNewVersion, animationData, animationTemplates } = getState();
  if (animationData.find(a => cardId === a.cardId) === undefined) return;
  // This also removes the corresponding animationTemplate from the queue
  dispatch(removeAnimation(cardId));

  if (getState().animationTemplates.length === 0 && newSnapshotsNewVersion.length > 0) {
    dispatch(replaceCurrentSnapshotWithNewSnapshotNewVersion(newSnapshotsNewVersion[0]));
    console.log("now new snapshots lenght = " + newSnapshotsNewVersion.length);
    handleNewSnapshots(getState().newSnapshotsNewVersion);
  }
};

export default handleEndAnimation;
