import createTransitionTemplatesFromChanges from "../animations/findChanges.ts/createTransitionTemplatesFromChanges";
import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import { RootState } from "../redux/store";
import { removeTransition, updateTransitionTemplate } from "../redux/transitionQueueActionCreators";
import { removeNewSnapshot, replaceCurrentSnapshotWithNewSnapshot } from "../redux/updateSnapshotActionCreators";
import addTransitionTemplatesToNewestSnapshot from "./addTransitionTemplatesToNewestSnapshot";

const handleTransitionEnd = (endingTransition: TransitionData) => (dispatch: Function, getState: () => RootState) => {
  const { gameSnapshot } = getState();
  // assign to mutablevalue to possibly get newest instance later...
  let newSnapshots = getState().newSnapshots;

  dispatch(removeTransition(endingTransition.cardId));
  // check if the current transition is the last active transition:
  if (getState().transitionData.length === 0) {
    // first check if more transitionTemplates are waiting in the stack
    const waitingTransitionTemplates = newSnapshots[0].transitionTemplates.filter(template => template.status === "waitingInLine");
    if (waitingTransitionTemplates.length > 0) {
      // if so "activate" them so the UI renders the emissaries and the
      // transitions can be created
      waitingTransitionTemplates.forEach(template => {
        template.status = "awaitingEmissaryData";
        dispatch(updateTransitionTemplate(template))
      });
      return;
    }

    // if NO transitionTemplates waiting, go ahead and delete the 
    // newGameSnapshot and copy its contents to the currSnapshot
    dispatch(replaceCurrentSnapshotWithNewSnapshot(newSnapshots[0]));
    dispatch(removeNewSnapshot(newSnapshots[0].id));
    // get newest copy of newSnapshots, with newestSnapshot removed
    newSnapshots = getState().newSnapshots;
    const isThisLastSnapshotInQueue = newSnapshots.length === 1;

    if (!isThisLastSnapshotInQueue) {
      // Now create the transitionTemplates for the next newSnapshot in the stack.
      dispatch(addTransitionTemplatesToNewestSnapshot());
    }
  }
};

export default handleTransitionEnd;
