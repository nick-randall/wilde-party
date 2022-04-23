import { v4 as uuidv4 } from "uuid";


const orderTransitions = {
  addDragged: { addDragged: 0 },
  destroy: { flyTodestroyedcard: 0, discard: 1, destroyedDiscard: 1 },
  steal: { flyToStolenCard: 0, discard: 1, stolenCardToNewHome: 1 },
};

// type TransitionTemplate = SnapshotChange & { id: string; orderOfExecution: number; animation?: string};

const createTransitionTemplates = (changes: SnapshotChange[], snapshotUpdateType: SnapshotUpdateType) : TransitionTemplate[] => {
  switch (snapshotUpdateType) {
    case "addDragged": 
    const transitionTemplate: TransitionTemplate = {...changes[0], animation: "flip", orderOfExecution: 0, id: uuidv4(), status: "awaitingEmissaryData"}
      return [transitionTemplate]
    // case "rearrangingHand":
    //   break;
     // return "rearrangingHand";
    case "destroy":
      // step One: find changed Card.
      const destroyedCard: ToOrFrom | undefined = changes.find(change => change.from.place === "GCZ")?.from;
      if (destroyedCard) {
        let handCardFliesToDestroyedCard: TransitionTemplate = {} as TransitionTemplate;
        let handCardFliesToDiscardPile: TransitionTemplate = {} as TransitionTemplate;
        let destroyedCardFliesToDiscardPile: TransitionTemplate = {} as TransitionTemplate;
        changes.forEach(change => {
          if (change.from.place === "hand") {
            // create two changes with orderOfExecution 0 and 1
            handCardFliesToDestroyedCard = { ...change, to: destroyedCard, orderOfExecution: 0, id: uuidv4(), status: "awaitingEmissaryData"};
            handCardFliesToDiscardPile = { ...change, from: destroyedCard, orderOfExecution: 1, id: uuidv4(), status: "waitingInLine"};
          }
          if (change.from.place === "GCZ") {
            destroyedCardFliesToDiscardPile = { ...change, orderOfExecution: 1, id: uuidv4(), status: "waitingInLine"};
          }
        });
        return [handCardFliesToDestroyedCard, handCardFliesToDiscardPile, destroyedCardFliesToDiscardPile];
      }
      break;

    // case "steal":
    // case "enchant":
    // case "protectSelf":
    // case "drawingWildeParty":
    // case "initialSnapshot":
    case "dealingInitialCard": {
    const transitionTemplate: TransitionTemplate = {...changes[0], animation: "flip", orderOfExecution: 0, id: uuidv4(), status: "awaitingEmissaryData"}
    return [transitionTemplate]
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


export default createTransitionTemplates;
