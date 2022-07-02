const createAnimationFromTemplate = (template: CompleteTransitionTemplate): AnimationData => {
  const { to, from } = template;
  console.log(template.animation)
  const xDelta = to.xPosition - from.xPosition;
  const yDelta = to.yPosition - from.yPosition;
  let newAnimationData: AnimationData = { cardId: to.cardId } as AnimationData;
  newAnimationData.originDelta = { x: xDelta, y: yDelta };
  newAnimationData.transitionCurve = "ease-out";
  newAnimationData.initialRotation = from.rotation;
  newAnimationData.transitionDuration = 500; // Should be calculated based on distance of originDelta
  newAnimationData.originDimensions = from.dimensions;
  newAnimationData.startAnimation = template.animation ?? "";
  newAnimationData.startAnimationDuration = 0;
  newAnimationData.wait = template.delay ?? 0;

  return newAnimationData;
};

export default createAnimationFromTemplate;
