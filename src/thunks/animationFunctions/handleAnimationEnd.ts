import { RootState } from "../../redux/store";
import { removeAnimation, updateAnimationTemplate } from "../../redux/transitionQueueActionCreators";
import { removeNewSnapshot, replaceCurrentSnapshotWithNewSnapshot } from "../../redux/updateSnapshotActionCreators";
import addAnimationTemplatesToNewestSnapshot from "./addAnimationTemplatesToNewestSnapshot";

const handleAnimationEnd = (endingCardId: string) => (dispatch: Function, getState: () => RootState) => {
  console.log("handle animation end, cardId: " + endingCardId);
  // assign to mutablevalue to possibly get newest instance later...
  let newSnapshots = getState().newSnapshots;

  // first check that the animation exists and wasn't already ended:
  const doesTransitionStillExistInState = getState().animationData.find(animation => animation.cardId === endingCardId) !== undefined;
  if (!doesTransitionStillExistInState) {
    console.log("animation doesn't exist in animationData");
    return;
  }

  dispatch(removeAnimation(endingCardId));

  if (getState().newSnapshots.length === 0) {
    return;
  }

  // check if the current animation is the last active animation:
  if (getState().animationData.length === 0) {
    // first check if more animationTemplates are waiting in the stack
    const waitingAnimationTemplates = newSnapshots[0].animationTemplates.filter(template => template.status === "waitingInLine");
    // const underWayTemplates = newSnapshots[0].animationTemplates.filter(template => template.status === "underway");
    // if(underWayTemplates.length > 0) return;
    if (waitingAnimationTemplates.length > 0) {
      // if so "activate" them so the UI renders the emissaries and the
      // animations can be created
      waitingAnimationTemplates.forEach(template => {
        template.status = "awaitingEmissaryData";
        console.log("setting animation status to awaitingEmissaryData: ", template);
        dispatch(updateAnimationTemplate(template));
      });
      return;
    }
    console.log("no waiting animation templates ");
    console.log("current NewSnapshot: ", newSnapshots[0]);

    // if NO animationTemplates waiting, go ahead and delete the
    // newGameSnapshot and copy its contents to the currSnapshot
    dispatch(removeNewSnapshot(newSnapshots[0].id));
    dispatch(replaceCurrentSnapshotWithNewSnapshot(newSnapshots[0]));
    console.log("after replacing current snapshot");
    console.log("current snapshot: ", getState().gameSnapshot);
    console.log("newSnapshots: ", getState().newSnapshots);
    // get newest copy of newSnapshots, with newestSnapshot removed
    newSnapshots = getState().newSnapshots;
    const isThisLastSnapshotInQueue = newSnapshots.length === 1;

    // if (!isThisLastSnapshotInQueue) {
      console.log("handleAnimationEnd: adding TransitinTemplates to newestSnapshot");
      // Now create the animationTemplates for the next newSnapshot in the stack.
      dispatch(addAnimationTemplatesToNewestSnapshot());
    // }
  }
};

export default handleAnimationEnd;
