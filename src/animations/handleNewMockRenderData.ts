import { RootState } from "../redux/store";
import { addMultipleAnimationsNewVersion, updateAnimationTemplateNewVersion } from "../redux/transitionQueueActionCreators";
import createAnimationFromTemplate from "../thunks/animationFunctions/createAnimationFromTemplate";

const handleNewMockRenderData = (mockRenderData: MockRenderData, toOrFrom: "to" | "from") => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = mockRenderData;
  const { animationTemplates } = getState();
  let currTemplate = animationTemplates.flatMap(group => group).filter(t => t.from.cardId === cardId)[0];
  if (toOrFrom === "from") {
    console.log("new from data")

    currTemplate = { ...currTemplate, from: { ...currTemplate.from, ...mockRenderData } };
  }

  if (toOrFrom === "to") {
    console.log("new to data")


    currTemplate = { ...currTemplate, to: { ...currTemplate.to, ...mockRenderData } };
  }

  dispatch(updateAnimationTemplateNewVersion(currTemplate));

  const animationTemplateGroup = getState().animationTemplates[0];

  if (animationTemplateGroup.every(t => t.status === "awaitingSimultaneousTemplates")) {
    const animationData = animationTemplateGroup.map(t => createAnimationFromTemplate(t as CompleteAnimationTemplateNewVersion));
    dispatch(addMultipleAnimationsNewVersion(animationData));
  }
};

export default handleNewMockRenderData;
