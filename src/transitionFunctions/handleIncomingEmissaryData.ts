import createTransitionFromTemplate from "./createTransitionFromTemplate";
import { RootState } from "../redux/store";
import { addMultipleTransitions, updateTransitionTemplate } from "../redux/transitionQueueActionCreators";

/**
 * Helper function for creating all transitions parallel to current completed one.
 */

export const createAllParallelTransitions = (currTemplate: TransitionTemplate, transitionTemplates: TransitionTemplate[]) => (dispatch: Function) => {
  currTemplate.status = "underway";
  const newTransition = createTransitionFromTemplate(currTemplate as CompleteTransitionTemplate);
  const allOtherTemplates = transitionTemplates.filter(template => template.id !== currTemplate.id);
  const templates = allOtherTemplates.map(template => ({ ...template, status: "underway" } as CompleteTransitionTemplate));
  const parallelTransitions = templates.map(template => createTransitionFromTemplate(template));
  allOtherTemplates.forEach(t => {
    const updatedTemplate: TransitionTemplate = { ...t, status: "underway" };
    dispatch(updateTransitionTemplate(updatedTemplate));
  });

  dispatch(addMultipleTransitions([newTransition, ...parallelTransitions]));
  // dispatch(addTransition(newTransition));
  return;
};

/**
 * This function is called when emissary to or from data is received.
 * */

export const handleEmissaryToData = (emissaryToData: EmissaryToData) => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = emissaryToData;
  const { transitionTemplates } = getState().newSnapshots[0];

  const currTemplate = transitionTemplates.find(template => template.from.cardId === cardId);
  if (currTemplate) {
    // update Template with emissary data
    currTemplate.to = { ...currTemplate.to, ...emissaryToData };

    // if Template has already had fromData added, create a new transition from it
    if (currTemplate.from.xPosition !== undefined) {
      // UNLESS there are others with the same order of execution
      // still waiting for emissary data
      const simultaneousTemplates = transitionTemplates.filter(template => currTemplate.orderOfExecution === template.orderOfExecution);
      const pendingsimultaneousTemplates = simultaneousTemplates.filter(template => template.status === "awaitingEmissaryData");
      if (pendingsimultaneousTemplates.length > 1) {
        currTemplate.status = "awaitingSimultaneousTemplates";
      } else {
        dispatch(createAllParallelTransitions(currTemplate, transitionTemplates));

        // dispatch(addTransition(newTransition));
        return;
      }
    }
    dispatch(updateTransitionTemplate(currTemplate));
  }
};

export const handleEmissaryFromData = (emissaryFromData: EmissaryFromData) => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = emissaryFromData;
  const { transitionTemplates } = getState().newSnapshots[0];
  const currTemplate = transitionTemplates.find(template => template.from.cardId === cardId);
  if (currTemplate) {
    // update Template with emissary data
    currTemplate.from = { ...currTemplate.from, ...emissaryFromData };

    // if Template has already had toData added, create a new transition from it
    if (currTemplate.to.xPosition !== undefined) {
      const simultaneousTemplates = transitionTemplates.filter(template => currTemplate.orderOfExecution === template.orderOfExecution);
      const pendingsimultaneousTemplates = simultaneousTemplates.filter(template => template.status === "awaitingEmissaryData");
      if (pendingsimultaneousTemplates.length > 1) {
        currTemplate.status = "awaitingSimultaneousTemplates";
      } else {
        dispatch(createAllParallelTransitions(currTemplate, transitionTemplates));

        // dispatch(addTransition(newTransition));
        return;
      }
    }
    dispatch(updateTransitionTemplate(currTemplate));
  }
};
