import { RootState } from "../redux/store";
import { addMultipleAnimations, updateAnimationTemplate } from "../redux/transitionQueueActionCreators";
import createAnimationFromTemplate from "../thunks/animationFunctions/createAnimationFromTemplate";

/**
 * Helper function for creating all Animations parallel to current completed one.
 */

export const createAllParallelAnimations = (currTemplate: AnimationTemplate, animationTemplates: AnimationTemplate[]) => (dispatch: Function) => {
  console.log("inside createallparallelanimations")
  currTemplate.status = "underway";
  const newAnimation = createAnimationFromTemplate(currTemplate as CompleteAnimationTemplate);
  const allOtherTemplates = animationTemplates.filter(template => template.id !== currTemplate.id);
  const templates = allOtherTemplates.map(template => ({ ...template, status: "underway" } as CompleteAnimationTemplate));
  const parallelAnimations = templates.map(template => createAnimationFromTemplate(template));
  allOtherTemplates.forEach(t => {
    const updatedTemplate: AnimationTemplate = { ...t, status: "underway" };
    dispatch(updateAnimationTemplate(updatedTemplate));
  });
  console.log(newAnimation);
  dispatch(addMultipleAnimations([newAnimation, ...parallelAnimations]));
  // dispatch(addTransition(newAnimation));
  return;
};

/**
 * This function is called when emissary to or from data is received.
 * */

export const handleEmissaryToData = (emissaryToData: EmissaryToData) => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = emissaryToData;
  const { animationTemplates } = getState().newSnapshots[0];
  console.log("+++++++++++++++++++")
  const currTemplate = animationTemplates.find(template => template.from.cardId === cardId);
  if (currTemplate) {
    // update Template with emissary data
    // currTemplate.to = { ...currTemplate.to, ...emissaryToData };
    let currTemplateCopy = { ...currTemplate, to: { ...currTemplate.to, ...emissaryToData } };
    // if Template has already had fromData added, create a new transition from it
    console.log("---------------")
    console.log("xPosition" in currTemplateCopy.from);
    console.log("xposition in currTemplate.from");
    if (currTemplateCopy.from.xPosition !== undefined) {
      // UNLESS there are others with the same order of execution
      // still waiting for emissary data
      const simultaneousTemplates = animationTemplates.filter(template => currTemplate.orderOfExecution === template.orderOfExecution);
      const pendingsimultaneousTemplates = simultaneousTemplates.filter(template => template.status === "awaitingEmissaryData");
      if (pendingsimultaneousTemplates.length > 1) {
        currTemplateCopy.status = "awaitingSimultaneousTemplates";
      } else {
        console.log("creating all parralel animations");
        dispatch(createAllParallelAnimations(currTemplateCopy, animationTemplates));

        // dispatch(addTransition(newAnimation));
        return;
      }
    }
    console.log(currTemplateCopy);
    dispatch(updateAnimationTemplate(currTemplateCopy));
  }
};

export const handleEmissaryFromData = (emissaryFromData: EmissaryFromData) => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = emissaryFromData;
  const { newSnapshots } = getState();
  if(newSnapshots.length < 1) return;
  const { animationTemplates } = getState().newSnapshots[0];
  const currTemplate = animationTemplates.find(template => template.from.cardId === cardId);
  if (currTemplate) {
    // update Template with emissary data
    let currTemplateCopy = { ...currTemplate, from: { ...currTemplate.from, ...emissaryFromData } };

    // if Template has already had toData added, create a new transition from it
    console.log("currTemplateCopy.to.xPosition !== undefined");
    console.log(currTemplateCopy.to.xPosition !== undefined);
    if (currTemplateCopy.to.xPosition !== undefined) {
      const simultaneousTemplates = animationTemplates.filter(template => currTemplateCopy.orderOfExecution === template.orderOfExecution);
      const pendingsimultaneousTemplates = simultaneousTemplates.filter(template => template.status === "awaitingEmissaryData");
      if (pendingsimultaneousTemplates.length > 1) {
        currTemplateCopy.status = "awaitingSimultaneousTemplates";
      } else {
        console.log("++++  ++++++", currTemplateCopy);
        dispatch(createAllParallelAnimations(currTemplateCopy, animationTemplates));

        // dispatch(addTransition(newAnimation));
        return;
      }
    }
    console.log(currTemplateCopy);
    dispatch(updateAnimationTemplate(currTemplateCopy));
  }
};
