import { RootState } from "../redux/store";
import { addScreenDataToTemplate, createAnimationsFromTemplates } from "../redux/transitionQueueActionCreators";

const handleNewMockRenderData = (mockRenderData: MockRenderData, toOrFrom: "to" | "from") => (dispatch: Function, getState: () => RootState) => {
  const { cardId } = mockRenderData;
  const { animationTemplates } = getState();
  let currTemplate = animationTemplates.flatMap(group => group).filter(t => t.from.cardId === cardId)[0];
  if (toOrFrom === "from") {
    currTemplate = { ...currTemplate, from: { ...currTemplate.from, ...mockRenderData } };
  }
  if (toOrFrom === "to") {
    currTemplate = { ...currTemplate, to: { ...currTemplate.to, ...mockRenderData } };
  }
  dispatch(addScreenDataToTemplate(currTemplate));

  const currTemplates = getState().animationTemplates.find(group => group.map(t => t.id === currTemplate.id));

  if (currTemplates && currTemplates.every(t => t.status === "awaitingSimultaneousTemplates")) {
    dispatch(createAnimationsFromTemplates(currTemplates.map(t => t as CompleteAnimationTemplate)))
  }
};

export default handleNewMockRenderData;
