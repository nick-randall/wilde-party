const createTransitionFromTemplate = (template: CompleteTransitionTemplate) : TransitionData => {
  const { to, from } = template;
  const xDelta = from.xPosition - to.xPosition;
  const yDelta = from.yPosition - to.yPosition;
  let newTransitionData: TransitionData = { cardId: to.cardId } as TransitionData;
  newTransitionData.originDelta = { x: xDelta, y: yDelta }
  newTransitionData.curve = "ease";
  newTransitionData.cardInitialrotation = from.rotation;
  newTransitionData.duration = 5000; // Should be calculated based on distance of originDelta
  newTransitionData.originDimensions = from.dimensions;
  newTransitionData.startAnimation = template.animation ?? "";
  newTransitionData.startAnimationDuration = 0;
  newTransitionData.wait = 0;

  return newTransitionData;
};

 export default createTransitionFromTemplate