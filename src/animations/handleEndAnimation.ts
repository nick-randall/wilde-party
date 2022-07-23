import { RootState } from "../redux/store";
import { clearAnimationTemplates, removeAnimation } from "../redux/transitionQueueActionCreators";
import { replaceCurrentSnapshotWithNewSnapshot } from "../redux/updateSnapshotActionCreators";
import handleNewSnapshots from "./handleNewSnapshots";

export const changeGroupStatus = (status: AnimationTemplateStatus, array: AnimationTemplate[]) =>
  array.map(t => ({ ...t, status: status }));

export const removeFirstElement = (array: any[]) => array.slice(1);

const handleEndAnimation = (cardId: string) => (dispatch: Function, getState: () => RootState) => {
  const { newSnapshots, animationData } = getState();
  if (animationData.find(a => cardId === a.cardId) === undefined) return;
  // This also removes the corresponding animationTemplate from the queue
  dispatch(removeAnimation(cardId));

  const isEveryTemplateComplete = getState()
    .animationTemplates.flat()
    .every(a => a.status === "complete");
    console.log(isEveryTemplateComplete? "every template complete" : "not every template complete")
  if (isEveryTemplateComplete && newSnapshots.length > 0) {
    dispatch(clearAnimationTemplates());
    dispatch(replaceCurrentSnapshotWithNewSnapshot(newSnapshots[0]));
    console.log("now new snapshots lenght = " + getState().newSnapshots.length);
    dispatch(handleNewSnapshots(getState().newSnapshots));
  }
};

export default handleEndAnimation;
