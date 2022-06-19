import { v4 as uuidv4 } from "uuid";

export type SnapshotUpdateSource = "localUser" | "server";

const orderTransitions = {
  addDragged: { addDragged: 0 },
  destroy: { flyTodestroyedcard: 0, discard: 1, destroyedDiscard: 1 },
  steal: { flyToStolenCard: 0, discard: 1, stolenCardToNewHome: 1 },
};

/**
 * Can be used for both local snapshot updates and snapshot updates from the server.
 *
 * @param differences
 * @param snapshotUpdateType
 * If snapshot update came from the user (true) or from the server.
 * @param snapshotUpdateSource
 * @param draggedCardScreenLocation
 * @param dimensions
 * @returns
 */
const createAnimationTemplatesFromSnapshotDifferences = (
  differences: SnapshotDifference[],
  snapshotUpdateType: SnapshotUpdateType,
  snapshotUpdateSource: SnapshotUpdateSource
): AnimationTemplate[] => {
  let templates = createAnimationTemplates(differences, snapshotUpdateType);

  /** If the user played a card to change the gameSnapshot, removes the initial transition,
  where the card transitions from the players' hand to the card's target location.
  This is necessary because the user has already dragged the card to its target location. 
  */
  if (snapshotUpdateSource === "localUser") {
    const templatesWithoutUserAction = templates.filter(template => template.orderOfExecution !== 0);
    templates = templatesWithoutUserAction.map(template => ({ ...template, orderOfExecution: template.orderOfExecution - 1 }));
  }
  return templates;
};

const createAnimationTemplates = (differences: SnapshotDifference[], snapshotUpdateType: SnapshotUpdateType): AnimationTemplate[] => {
  console.log("numDifferences is " + differences.length);

  switch (snapshotUpdateType) {
    case "addDragged": {
      let transitionTemplate: AnimationTemplate = {
        ...differences[0],
        animation: "flip",
        orderOfExecution: 0,
        id: uuidv4(),
        status: "awaitingEmissaryData",
      };
      // if (draggedCardScreenLocation !== null && dimensions !== null) {
      //   const { xPosition, yPosition } = draggedCardScreenLocation;
      //   const { from } = transitionTemplate;
      //   const dimensionswithoutrotation = { ...dimensions, rotation: () => 0 };
      //   transitionTemplate = { ...transitionTemplate, from: { ...from, xPosition, yPosition, rotation: 0, dimensions: dimensionswithoutrotation } };

      //   console.log(transitionTemplate);
      //   // transitionTemplate.from.xPosition = draggedCardScreenLocation.xPosition
      //   // transitionTemplate.from.yPosition = draggedCardScreenLocation.yPosition
      // }
      return [transitionTemplate];
    }
    // case "rearrangingHand":
    //   break;
    // return "rearrangingHand";
    case "destroy": {
      // step One: find changed Card.
      const destroyedCard: ToOrFrom | undefined = differences.find(change => change.from.place === "GCZ")?.from;
      if (destroyedCard) {
        let handCardFliesToDestroyedCard: AnimationTemplate = {} as AnimationTemplate;
        let handCardFliesToDiscardPile: AnimationTemplate = {} as AnimationTemplate;
        let destroyedCardFliesToDiscardPile: AnimationTemplate = {} as AnimationTemplate;
        differences.forEach(change => {
          if (change.from.place === "hand") {
            // create two differences with orderOfExecution 0 and 1
            handCardFliesToDestroyedCard = { ...change, to: destroyedCard, orderOfExecution: 0, id: uuidv4(), status: "awaitingEmissaryData" };
            handCardFliesToDiscardPile = { ...change, from: destroyedCard, orderOfExecution: 1, id: uuidv4(), status: "waitingInLine" };
          }
          if (change.from.place === "GCZ") {
            destroyedCardFliesToDiscardPile = { ...change, orderOfExecution: 1, id: uuidv4(), status: "waitingInLine" };
          }
        });
        return [handCardFliesToDestroyedCard, handCardFliesToDiscardPile, destroyedCardFliesToDiscardPile];
      }
      return [];
    }
    // case "steal":
    // case "enchant":
    // case "protectSelf":
    // case "drawingWildeParty":
    // case "initialSnapshot":
    case "dealingInitialCard": {
      const transitionTemplate: AnimationTemplate = {
        ...differences[0],
        animation: "",
        orderOfExecution: 0,
        id: uuidv4(),
        status: "awaitingEmissaryData",
      };
      return [transitionTemplate];
    }
    case "dealingCards": {
      const templates: AnimationTemplate[] = [];
      differences.forEach((difference, index) => {
        const transitionTemplate: AnimationTemplate = {
          ...difference,
          animation: "flipGrow",
          orderOfExecution: 0,
          id: uuidv4(),
          status: "awaitingEmissaryData",
          delay: differences.length * 100 - (index * 100)
        };
        templates.push(transitionTemplate);
      });

      return templates;
    }
  }
  // if (from.placeType === "deck") {
  //   return "drawCard";
  // }

  // if (from.placeType === "hand") {
  //   switch (to.placeType) {
  // case "discardPile":
  //   return "discard";
  // case "GCZ":
  //   return "addDragged"; // enchant is logically the same
  // case ""
  // }

  // if (from.placeType === "GCZ") {
  //   switch (to.placeType) {
  //     case "discardPile":
  //       return "destroy";
  //     case "GCZ": // assuming we have already checked it is not just a rearrange
  //       return "swap";
  //   }

  // }
  return [];
};

export default createAnimationTemplatesFromSnapshotDifferences;
