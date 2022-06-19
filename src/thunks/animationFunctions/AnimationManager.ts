import { nonPlayerPlacesTypes, playerPlacesTypes } from "../../helperFunctions/locateFunctions";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";
import { RootState } from "../../redux/store";

class AnimationManager {

  currSnapshot: GameSnapshot;

  newSnapshot: NewSnapshot;

  snapshotUpdateSource: SnapshotUpdateSource;

  animationData: AnimationData[] = [];

  // constructor(currSnapshot: GameSnapshot, newSnapshot: NewSnapshot, animationData: AnimationData[], snapshotUpdateSource: SnapshotUpdateSource) {
  //   this.currSnapshot = currSnapshot;
  //   this.newSnapshot = newSnapshot;
  //   this.animationData = animationData;
  //   this.snapshotUpdateSource = snapshotUpdateSource;
  // }

  constructor(state: RootState, snapshotUpdateSource: SnapshotUpdateSource) {
    const { gameSnapshot, newSnapshots, animationData } = state;
    this.currSnapshot = gameSnapshot;
    this.newSnapshot = newSnapshots[0];
    this.animationData = animationData;
    this.snapshotUpdateSource = snapshotUpdateSource;
  }

  setAnimationTemplates = () => {
    this.newSnapshot = produce(this.newSnapshot, draft => {
      const snapshotDifferences = this.findSnapshotDifferences(this.currSnapshot, this.newSnapshot);
      const newAnimationTemplates = this.createAnimationTemplates(snapshotDifferences, this.snapshotUpdateSource);
      draft.animationTemplates = newAnimationTemplates;
    });
  };

  updateAnimationTemplateStatus = (animationTemplate: AnimationTemplate, status: AnimationTemplateStatus) => {
    const animationToUpdate = this.newSnapshot.animationTemplates.find(t => animationTemplate.id === t.id);
    if (animationToUpdate) {
      return { ...animationTemplate, status };
    }
  };

  // updateAnimationTemplateStatus = () => {};
  // TODO probably have to update EmissaryTOData to also include dimensions and rotation
  handleNewAnimationTemplateScreenData = (emissaryData: EmissaryToData | EmissaryFromData, toOrFrom: string) => {
    const { cardId } = emissaryData;
    const currTemplate = this.newSnapshot.animationTemplates.find(template => template.from.cardId === cardId);

    if (currTemplate) {
      // Set currUpdating

      let updatedTemplate = produce(currTemplate, draft => {
        if (toOrFrom === "to") {
          draft.to = { ...draft.to, ...emissaryData };
        }
        if (toOrFrom === "from") {
          draft.from = { ...draft.from, ...emissaryData };
        }
      });

      this.updateAnimationTemplateScreenData(updatedTemplate);

      if (this.isTemplateComplete(updatedTemplate)) {
        this.updateAllSimultaneousTemplatesIfReady(updatedTemplate);
      }
    } else {
      console.log("currTemplate not found!");
    }
  };

  updateAllSimultaneousTemplatesIfReady = (updatedTemplate: AnimationTemplate) => {
    const { orderOfExecution } = updatedTemplate;
    const simultaneousTemplates = this.newSnapshot.animationTemplates.filter(template => template.orderOfExecution === orderOfExecution);
    if (simultaneousTemplates.every(template => template.status === "awaitingSimultaneousTemplates")) {
      simultaneousTemplates.map(template => ({ ...template, status: "underway" }));
    }
  };  

  isTemplateComplete = (animationTemplate: AnimationTemplate): boolean => {
    return "xPosition" in animationTemplate.to && "xPosition" in animationTemplate.from;
  };

  updateAnimationTemplateScreenData = (animationTemplate: AnimationTemplate) => {
    let updatedCopy = { ...animationTemplate };
    if (this.isTemplateComplete(animationTemplate)) {
      updatedCopy = { ...animationTemplate, status: "awaitingSimultaneousTemplates" };
    }
    const withoutUpdatedTemplate = this.newSnapshot.animationTemplates.filter(t => t.id !== animationTemplate.id);
    const withUpdated = [...withoutUpdatedTemplate, updatedCopy];

    this.newSnapshot.animationTemplates = withUpdated;
  };

  createAnimationFromTemplate = () => {};

  removeAnimation = () => {};
  /**
   * Set currSnapshot to newSnapshot and remove newSnapshot from the queue
   */
  endNewSnapshot = () => {};

  createAnimationTemplates = (differences: SnapshotDifference[], snapshotUpdateSource: SnapshotUpdateSource): AnimationTemplate[] => {
    let animationTemplates: AnimationTemplate[] = [];

    switch (this.newSnapshot.snapshotUpdateType) {
      case "addDragged": {
        let transitionTemplate: AnimationTemplate = {
          ...differences[0],
          animation: "",
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
        animationTemplates = [transitionTemplate];

        break;
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
        animationTemplates = [];
        break;
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
      case "dealingCards":
        {
          const templates: AnimationTemplate[] = [];
          differences.forEach((difference, index) => {
            const transitionTemplate: AnimationTemplate = {
              ...difference,
              animation: "flipGrow",
              orderOfExecution: 0,
              id: uuidv4(),
              status: "awaitingEmissaryData",
              delay: differences.length * 100 - index * 100,
            };
            templates.push(transitionTemplate);
          });

          animationTemplates = templates;
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
        animationTemplates = [];
        break;
    }

    if (snapshotUpdateSource === "localUser") {
      const templatesWithoutUserAction = animationTemplates.filter(template => template.orderOfExecution !== 0);
      animationTemplates = templatesWithoutUserAction.map(template => ({ ...template, orderOfExecution: template.orderOfExecution - 1 }));
    }
    return animationTemplates;
  };

  findSnapshotDifferences = (prevSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
    //if (prevSnapshot.players.length === 0) return [];
    const snapshotDifferences = [];
    const players = prevSnapshot.players;

    for (let player = 0; player < players.length; player++) {
      for (let place of playerPlacesTypes) {
        // run this for each "place array"
        const prevCardIds = prevSnapshot.players[player].places[place].cards.map(card => card.id);
        const newCardIds = newSnapshot.players[player].places[place].cards.map(card => card.id);
        const playerId = prevSnapshot.players[player].id;
        const placeId = prevSnapshot.players[player].places[place].id;

        let differences = prevCardIds.filter(card => !newCardIds.includes(card));
        if (differences.length === 0) {
        } else {
          for (let i = 0; i < differences.length; i++) {
            let snapshotDifference: SnapshotDifference = {
              from: {
                cardId: differences[i],
                place: place,
                placeId: placeId,
                player: player,
                playerId: playerId,
                index: prevCardIds.indexOf(differences[i]),
              },
              // "to" gets placeholder values.
              to: {
                cardId: differences[i],
                place: place,
                placeId: placeId,
                player: player,
                playerId: playerId,
                index: prevCardIds.indexOf(differences[i]),
              },
            };
            snapshotDifferences.push(snapshotDifference);
          }
        }
      }
    }

    // now check deck & discard pile
    for (let place of nonPlayerPlacesTypes) {
      const prevCardIds = prevSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
      const newCardIds = newSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
      let differences = prevCardIds.filter(card => !newCardIds.includes(card));

      const placeId = prevSnapshot.nonPlayerPlaces[place].id;

      if (differences.length === 0) {
      } else {
        for (let i = 0; i < differences.length; i++) {
          let snapshotDifference: SnapshotDifference = {
            from: {
              cardId: differences[i],
              place: place,
              placeId: placeId,
              player: null,
              playerId: null,
              index: prevCardIds.indexOf(differences[i]),
            },
            to: {
              cardId: differences[i],
              placeId: placeId,
              place: place,
              player: null,
              playerId: null,
              index: prevCardIds.indexOf(differences[i]),
            },
          };

          snapshotDifferences.push(snapshotDifference);
        }
      }
    }
    // find those missing cards!!!
    for (let snapshotDifference = 0; snapshotDifference < snapshotDifferences.length; snapshotDifference++) {
      for (let player = 0; player < players.length; player++) {
        for (let place of playerPlacesTypes) {
          let i = 0;
          const newCardIds = newSnapshot.players[player].places[place].cards.map(card => card.id);
          const playerId = newSnapshot.players[player].id;
          const placeId = newSnapshot.players[player].places[place].id;
          for (i = 0; i < newSnapshot.players[player].places[place].cards.length; i++) {
            if (newCardIds[i] === snapshotDifferences[snapshotDifference]["from"]["cardId"]) {
              snapshotDifferences[snapshotDifference]["to"] = {
                cardId: snapshotDifferences[snapshotDifference]["from"]["cardId"],
                place: place,
                placeId: placeId,
                player: player,
                playerId: playerId,
                index: i,
              };
              break;
            }
          }
        }
      }
    }

    // now  check deck & discard pile for those missing cards!!!
    for (let snapshotDifference = 0; snapshotDifference < snapshotDifferences.length; snapshotDifference++) {
      for (let place of nonPlayerPlacesTypes) {
        let i = 0;
        const newCardIds = newSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
        const placeId = newSnapshot.nonPlayerPlaces[place].id;

        for (i = 0; i < newSnapshot.nonPlayerPlaces[place].cards.length; i++) {
          if (newCardIds[i] === snapshotDifferences[snapshotDifference]["from"]["cardId"]) {
            snapshotDifferences[snapshotDifference]["to"] = {
              cardId: snapshotDifferences[snapshotDifference]["from"]["cardId"],
              place: place,
              placeId: placeId,
              player: null,
              playerId: null,
              index: i,
            };
            break; //i = newSnapshot.nonPlayerPlaces[place].cards.length;
          }
        }
      }
    }
    return snapshotDifferences;
  };

  getNewSnapshot = () => this.newSnapshot;
}

export default AnimationManager;
