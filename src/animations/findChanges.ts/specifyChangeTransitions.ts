
const orderTransitions = {
  addDragged: { addDragged: 0 },
  destroy: { flyTodestroyedcard: 0, discard: 1, destroyedDiscard: 1 },
  steal: { flyToStolenCard: 0, discard: 1, stolenCardToNewHome: 1 },
};

type UpdateTransition = SnapshotChange & { orderOfExecution: number; animation?: string };

const specifyChangeTransitions = (changes: SnapshotChange[], snapshotUpdateType: SnapshotUpdateType) => {
  switch (snapshotUpdateType) {
    case "rearrangingHand":
      return "rearrangingHand";
    case "destroy":
      // step One: find changed Card.
      const destroyedCard: ToOrFrom | undefined = changes.find(change => change.from.place === "GCZ")?.from;
      if (destroyedCard) {
        let handCardFliesToDestroyedCard: UpdateTransition = {} as UpdateTransition;
        let handCardFliesToDiscardPile: UpdateTransition = {} as UpdateTransition;
        let destroyedCardFliesToDiscardPile: UpdateTransition = {} as UpdateTransition;
        changes.forEach(change => {
          if (change.from.place === "hand") {
            // create two changes with orderOfExecution 0 and 1
            handCardFliesToDestroyedCard = { ...change, to: destroyedCard, orderOfExecution: 0};
            handCardFliesToDiscardPile = { ...change, from: destroyedCard, orderOfExecution: 1};
          }
          if (change.from.place === "GCZ") {
            destroyedCardFliesToDiscardPile = { ...change, orderOfExecution: 1};
          }
        });
        return [handCardFliesToDestroyedCard, handCardFliesToDiscardPile, destroyedCardFliesToDiscardPile];
      }
      break;
    case "steal":
    case "enchant":
    case "protectSelf":
    case "drawingWildeParty":
    case "initialSnapshot":
      return [];
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
};


export default specifyChangeTransitions;
