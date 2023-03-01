import { RootState } from "../redux/store";
import { addScreenDataToTemplate, createAnimationsFromTemplates } from "../redux/transitionQueueActionCreators";

const handleNewMockRenderData =
  (mockRenderData: MockRenderData, toOrFrom: "to" | "from" | "intermediate") => (dispatch: Function, getState: () => RootState) => {
    const { cardId } = mockRenderData;
    const { animationTemplates } = getState();

    let currTemplate: AnimationTemplate;
    if (toOrFrom === "intermediate") {
      // This ought to work! For intermediateAnimations we capture the targetId(where the moving card passes over),
      // not the id of the card moving.
      // currTemplate = animationTemplates.flat().filter(t => (t.intermediateSteps ? t.intermediateSteps.flat().find(step => step.targetId === cardId) !==undefined : false)[0];
      currTemplate = animationTemplates.flat().filter(a => a.intermediateSteps?.some(step => step.targetId === cardId))[0];
      const currStep = currTemplate.intermediateSteps?.filter(step => step.targetId === cardId)[0];
      if (currStep) {
        const stepWithScreenData = {...currStep, ...mockRenderData }
        const intermediateSteps = currTemplate.intermediateSteps?.map(step => (step.targetId === cardId ? stepWithScreenData : step));
        currTemplate = { ...currTemplate, intermediateSteps };
      }
    } else {
      currTemplate = animationTemplates.flat().filter(t => t.cardId === cardId)[0];
      if (toOrFrom === "from") {
        currTemplate = { ...currTemplate, from: { ...currTemplate.from, ...mockRenderData } };
      }
      if (toOrFrom === "to") {
        currTemplate = { ...currTemplate, to: { ...currTemplate.to, ...mockRenderData } };
      }
    }

    dispatch(addScreenDataToTemplate(currTemplate));

    const currTemplates = getState().animationTemplates.find(group => group.map(t => t.id === currTemplate.id));

    if (currTemplates && currTemplates.every(t => t.status === "awaitingSimultaneousTemplates")) {
      dispatch(createAnimationsFromTemplates(currTemplates.map(t => t as CompleteAnimationTemplate)));
    }
  };

export default handleNewMockRenderData;
