import { RootState } from "../redux/store";
import { removeTransition, updateTransitionTemplate } from "../redux/transitionQueueActionCreators";
import { removeNewSnapshot, replaceCurrentSnapshotWithNewSnapshot } from "../redux/updateSnapshotActionCreators";
import addTransitionTemplatesToNewestSnapshot from "./addTransitionTemplatesToNewestSnapshot";

const handleTransitionEnd = (endingTransition: TransitionData) => (dispatch: Function, getState: () => RootState) => {
  console.log("handle transition end, cardId: " + endingTransition.cardId);
  // assign to mutablevalue to possibly get newest instance later...
  let newSnapshots = getState().newSnapshots;

  // first check that the transition exists and wasn't already ended:
  const doesTransitionStillExistInState = getState().transitionData.find(transition => transition.cardId === endingTransition.cardId) !== undefined;
  if (!doesTransitionStillExistInState) {
    console.log("transition doesn't exist in transitionData");
    return;
  }

  dispatch(removeTransition(endingTransition.cardId));

  if (getState().newSnapshots.length === 0) {
    return;
  }

  // check if the current transition is the last active transition:
  if (getState().transitionData.length === 0) {
    // first check if more transitionTemplates are waiting in the stack
    const waitingTransitionTemplates = newSnapshots[0].transitionTemplates.filter(template => template.status === "waitingInLine");
    // const underWayTemplates = newSnapshots[0].transitionTemplates.filter(template => template.status === "underway");
    // if(underWayTemplates.length > 0) return;
    if (waitingTransitionTemplates.length > 0) {
      // if so "activate" them so the UI renders the emissaries and the
      // transitions can be created
      waitingTransitionTemplates.forEach(template => {
        template.status = "awaitingEmissaryData";
        console.log("setting transition status to awaitingEmissaryData: ", template);
        dispatch(updateTransitionTemplate(template));
      });
      return;
    }
    console.log("no waiting transition templates ");
    console.log("current NewSnapshot: ", newSnapshots[0]);

    // if NO transitionTemplates waiting, go ahead and delete the
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
      console.log("handleTransitionEnd: adding TransitinTemplates to newestSnapshot");
      // Now create the transitionTemplates for the next newSnapshot in the stack.
      dispatch(addTransitionTemplatesToNewestSnapshot());
    // }
  }
};

export default handleTransitionEnd;
