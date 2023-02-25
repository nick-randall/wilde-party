import { RootState } from "../redux/store";
import { addScreenDataToTemplate, createAnimationsFromTemplates } from "../redux/transitionQueueActionCreators";

const handleNewMockRenderData =
  (mockRenderData: MockRenderData, toOrFrom: "to" | "from" | "via") => (dispatch: Function, getState: () => RootState) => {
    const { cardId } = mockRenderData;
    const { animationTemplates } = getState();

    let currTemplate: AnimationTemplate;
    if (toOrFrom === "via") {
      // This ought to work! For Via we capture the targetId(where the moving card passes over),
      // not the id of the card moving.
      currTemplate = animationTemplates.flat().filter(t => (t.via ? t.via.targetId === cardId : undefined))[0];
      const via: ViaWithPossibleScreenData = { targetId: cardId, ...mockRenderData };
      currTemplate = { ...currTemplate, via: via };
    }

    else {
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
