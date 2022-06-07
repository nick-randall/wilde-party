const createTransitionFromTemplate = (template: CompleteTransitionTemplate) : TransitionData => {
  const { to, from } = template;
  const xDelta = from.xPosition - to.xPosition;
  const yDelta = from.yPosition - to.yPosition;
  let newTransitionData: TransitionData = { cardId: to.cardId } as TransitionData;
  newTransitionData.originDelta = { x: xDelta, y: yDelta }
  newTransitionData.curve = "ease-out";
  newTransitionData.cardInitialrotation = from.rotation;
  newTransitionData.duration = 300; // Should be calculated based on distance of originDelta
  newTransitionData.originDimensions = from.dimensions;
  newTransitionData.startAnimation = template.animation ?? "";
  newTransitionData.startAnimationDuration = 0;
  newTransitionData.wait = 100;

  return newTransitionData;
};

 export default createTransitionFromTemplate