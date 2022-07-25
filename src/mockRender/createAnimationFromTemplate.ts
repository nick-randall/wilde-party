const createAnimationFromTemplate = (template: CompleteAnimationTemplate): AnimationData => {
  const { to, from } = template;
  const xDelta = from.xPosition - to.xPosition;
  const yDelta = from.yPosition - to.yPosition;
  let newAnimationData: AnimationData = { cardId: to.cardId } as AnimationData;
  newAnimationData.originDelta = { x: xDelta, y: yDelta };
  newAnimationData.transitionCurve = "ease-out";
  newAnimationData.finalRotation = to.rotation || 0;
  newAnimationData.initialRotation = from.rotation || 0;
  newAnimationData.transitionDuration = 900; // Should be calculated based on distance of originDelta
  newAnimationData.originDimensions = from.dimensions;
  newAnimationData.finalDimensions = to.dimensions;

  newAnimationData.startAnimation = template.animation ?? "";
  newAnimationData.startAnimationDuration = 0;
  newAnimationData.wait = template.delay ?? 0;
  console.log(newAnimationData.startAnimation)
  return newAnimationData;
};

export default createAnimationFromTemplate;
