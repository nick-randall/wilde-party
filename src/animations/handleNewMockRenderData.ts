import { RootState } from "../redux/store";
import { addMultipleAnimationsNewVersion } from "../redux/transitionQueueActionCreators";
import createAnimationFromTemplate from "../thunks/animationFunctions/createAnimationFromTemplate";

const handleNewMockRenderData = (mockRenderData: MockRenderData, toOrFrom: "to" | "from") => (dispatch: Function, getState: () => RootState) => {
  const { templateId } = mockRenderData;
  const { animationTemplates } = getState();
  let currTemplate = animationTemplates.flatMap(group => group).filter(t => t.id === templateId)[0];

  if (toOrFrom === "from") {
    currTemplate = { ...currTemplate, from: { ...currTemplate.from, ...mockRenderData } };
  }
  
  if (toOrFrom === "to") {
    currTemplate = { ...currTemplate, to: { ...currTemplate.to, ...mockRenderData } };
  }

  const isTemplateComplete = currTemplate.to.xPosition !== undefined && currTemplate.from.xPosition !== undefined;

  if (isTemplateComplete) {
    currTemplate.status = "awaitingSimultaneousTemplates";

    const areAllTemplatesReady = animationTemplates[0].filter(t => t.status === "awaitingEmissaryData").length === 0;

    if (areAllTemplatesReady) {
      dispatch(createNewAnimations());
    }
  }
};

export default handleNewMockRenderData;

const createNewAnimations = () => (dispatch: Function, getState: () => RootState) => {
  const { animationTemplates } = getState();
  const animationData = animationTemplates[0].map(t => createAnimationFromTemplate(t as CompleteAnimationTemplateNewVersion));
  dispatch(addMultipleAnimationsNewVersion(animationData));
};
