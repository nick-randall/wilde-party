import createTransitionFromTemplate from "../transitionFunctions.ts/createTransitionFromTemplate";
import { RootState } from "./store";
import {  addTransition, updateTransitionTemplate } from "./transitionQueueActionCreators";

/**
 * This function iscalled when emissary to or from data is received.
 * */

export const handleEmissaryToData = (emissaryToData: EmissaryToData) => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = emissaryToData;
  const { transitionTemplates } = getState().newSnapshots[0];

  const currTemplate = transitionTemplates.find(template => template.from.cardId === cardId);
  if (currTemplate) {
    // update Template with emissary data
    currTemplate.to = { ...currTemplate.to, ...emissaryToData };

    // if Template has already had fromData added, create a new transition from it
    console.log(currTemplate)
    if (currTemplate.from.xPosition !== undefined) {
      // could add IF clause here to check that others with its
      // orderOFExecution are also ready
      currTemplate.status = "underway";
      console.log("TO: currentTemplate should dispatch new transitionData")
      const newTransition = createTransitionFromTemplate(currTemplate as CompleteTransitionTemplate)
      console.log(newTransition)
      dispatch(addTransition(newTransition))
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
      currTemplate.status = "underway";
      console.log("FROM: currentTemplate should dispatch new transitionData")
      console.log(currTemplate)
      const newTransition = createTransitionFromTemplate(currTemplate as CompleteTransitionTemplate)
      dispatch(addTransition(newTransition))
    }
    dispatch(updateTransitionTemplate(currTemplate));
  }
};
