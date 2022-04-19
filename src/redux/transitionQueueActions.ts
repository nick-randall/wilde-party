import { RootState } from "./store";
import { addNewTransition, updateTransitionTemplate } from "./transitionQueueActionCreators";

/**
 * called when emissary to or from data is received.
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
      currTemplate.status = "underway";
      dispatch(createTransitionFromTemplate(currTemplate as CompleteTransitionTemplate));
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
    currTemplate.to = { ...currTemplate.to, ...emissaryFromData };

    // if Template has already had toData added, create a new transition from it
    if (currTemplate.to.xPosition !== undefined) {
      currTemplate.status = "underway";
      dispatch(createTransitionFromTemplate(currTemplate as CompleteTransitionTemplate));
    }
    dispatch(updateTransitionTemplate(currTemplate));
  }
};

const createTransitionFromTemplate = (template: CompleteTransitionTemplate) => (dispatch: Function, getState: () => RootState) => {
  const { to, from } = template;
  const xDelta = from.xPosition - to.xPosition;
  const yDelta = from.yPosition - to.yPosition;
  
  let newTransitionData: TransitionData = { cardId: to.cardId } as TransitionData;
  newTransitionData.originDelta = { xDelta, yDelta }
  newTransitionData.curve = "ease";
  newTransitionData.cardInitialrotation = from.rotation;
  newTransitionData.duration = 1000; // Should be calculated based on distance of originDelta
  newTransitionData.originDimensions = from.dimensions;
  newTransitionData.startAnimation = "";
  newTransitionData.startAnimationDuration = 0;
  newTransitionData.wait = 0;
  dispatch(addNewTransition(newTransitionData))
};

