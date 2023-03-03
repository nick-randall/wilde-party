import { AnimationBuilder } from "./AnimationBuilder";
// Handles animations that wait for each other
const createKeyframes = (templates: CompleteAnimationTemplate[]) => {
  let waitingTemplates = templates.filter(template => template.hasOwnProperty("awaits"));

  const waitingKeyframes: AnimationData[] = waitingTemplates.map(waitingtemplate => {
    let currWaitingTemplate = waitingtemplate;
    const awaitedTemplate = templates.find(template => template.id === waitingtemplate.awaits);
    if (awaitedTemplate) {
      const awaitedTemplateAnimationBuilder = new AnimationBuilder(awaitedTemplate);
      const awaitedAnimationTotalDuration = awaitedTemplateAnimationBuilder.totalDuration ?? 0;
      currWaitingTemplate = { ...waitingtemplate, delay: awaitedAnimationTotalDuration };
    }
    return new AnimationBuilder(currWaitingTemplate).getAnimationData();
  });

  const otherTemplates = templates.filter(template => !template.hasOwnProperty("awaits"));
  const otherKeyFrames = otherTemplates.map(template => new AnimationBuilder(template).getAnimationData());

  return [...otherKeyFrames, ...waitingKeyframes];
};

export default createKeyframes;
