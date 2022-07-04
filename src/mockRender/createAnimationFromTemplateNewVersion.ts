const createAnimationFromTemplate = (template: CompleteAnimationTemplateNewVersion): AnimationData => {
  const { to, from } = template;
  const xDelta = to.xPosition - from.xPosition;
  const yDelta = to.yPosition - from.yPosition;
  let newAnimationData: AnimationData = { cardId: to.cardId } as AnimationData;
  newAnimationData.originDelta = { x: xDelta, y: yDelta };
  newAnimationData.transitionCurve = "ease-out";
  newAnimationData.finalRotation = to.rotation;
  newAnimationData.initialRotation = from.rotation;
  newAnimationData.transitionDuration = 900; // Should be calculated based on distance of originDelta
  newAnimationData.originDimensions = from.dimensions;
  newAnimationData.finalDimensinos = to.dimensions;

  // newAnimationData.startAnimation = template.animation ?? "";
  newAnimationData.startAnimationDuration = 0;
  newAnimationData.wait = template.delay ?? 0;

  return newAnimationData;
};

export default createAnimationFromTemplate;
