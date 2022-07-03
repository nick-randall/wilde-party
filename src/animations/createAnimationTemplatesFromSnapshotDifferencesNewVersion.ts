import { v4 as uuidv4 } from "uuid";
import { findSnapshotDifferences } from "../transitionFunctions/findSnapshotDifferences/findSnapshotDifferences";
import { changeGroupStatus } from "./handleEndAnimation";

export type SnapshotUpdateSource = "localUser" | "server";

const createAnimationTemplates = (currSnapshot: GameSnapshot, newSnapshot: GameSnapshot): AnimationTemplateNewVersion[][] => {
  const snapshotDifferences = findSnapshotDifferences(currSnapshot, newSnapshot);
  const animationTemplates = createAnimationTemplatesFromSnapshotDifferencesNewVersion(snapshotDifferences, newSnapshot.snapshotUpdateType, "server");
  return animationTemplates;
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
const createAnimationTemplatesFromSnapshotDifferencesNewVersion = (
  differences: SnapshotDifference[],
  snapshotUpdateType: SnapshotUpdateType,
  snapshotUpdateSource: SnapshotUpdateSource
): AnimationTemplateNewVersion[][] => {
  let templateGroups = returnAnimationTemplates(differences, snapshotUpdateType);

  /** If the user played a card to change the gameSnapshot, removes the initial transition,
  where the card transitions from the players' hand to the card's target location.
  This is necessary because the user has already dragged the card to its target location. 
  */
  if (snapshotUpdateSource === "localUser") {
    const updatedTemplateGroups = changeGroupStatus("awaitingEmissaryData", templateGroups[1]);
    templateGroups = [updatedTemplateGroups, ...templateGroups.slice(1)];
  }
  return templateGroups;
};

const returnAnimationTemplates = (differences: SnapshotDifference[], snapshotUpdateType: SnapshotUpdateType): AnimationTemplateNewVersion[][] => {
 
  switch (snapshotUpdateType) {
    case "addDragged": {
      let transitionTemplate: AnimationTemplateNewVersion = {
        ...differences[0],
        animation: "flip",
        status: "awaitingEmissaryData",
        id: uuidv4(),
      };
      return [[transitionTemplate]];
    }
    // case "rearrangingHand":
    //   break;
    // return "rearrangingHand";
    case "destroy": {
      const destroyedCardFromData: ToOrFrom | undefined = differences.find(change => change.from.place === "GCZ")?.from;
      if (destroyedCardFromData) {

        const destroyedCard: Via = { cardId: destroyedCardFromData.cardId, targetId: destroyedCardFromData.cardId };

        let handCardFliesToDestroyedCard: AnimationTemplateNewVersion = {} as AnimationTemplateNewVersion;
        let handCardFliesToDiscardPile: AnimationTemplateNewVersion = {} as AnimationTemplateNewVersion;
        let destroyedCardFliesToDiscardPile: AnimationTemplateNewVersion = {} as AnimationTemplateNewVersion;
        differences.forEach(change => {
          if (change.from.place === "hand") {
            // create two differences with orderOfExecution 0 and 1
            handCardFliesToDestroyedCard = { ...change, to: destroyedCard, id: uuidv4(), status: "awaitingEmissaryData" };
            handCardFliesToDiscardPile = { ...change, from: destroyedCard, id: uuidv4(), status: "waitingInLine" };
          }
          if (change.from.place === "GCZ") {
            destroyedCardFliesToDiscardPile = { ...change, id: uuidv4(), status: "waitingInLine" };
          }
        });
        return [[handCardFliesToDestroyedCard], [handCardFliesToDiscardPile, destroyedCardFliesToDiscardPile]];
      }
      return [];
    }
    // case "steal":
    // case "swap":
    // case "enchant":
    // case "protectSelf":
    // case "drawingWildeParty":
    // case "initialSnapshot":
    case "dealingInitialCard": {
      const transitionTemplate: AnimationTemplateNewVersion = {
        ...differences[0],
        animation: "",
        id: uuidv4(),
        status: "awaitingEmissaryData",
      };
      return [[transitionTemplate]];
    }
    case "dealingCards": {
      const templates: AnimationTemplateNewVersion[] = [];
      differences.forEach((difference, index) => {
        const transitionTemplate: AnimationTemplateNewVersion = {
          ...difference,
          animation: "",
          id: uuidv4(),
          status: "awaitingEmissaryData",
          delay: differences.length * 200 - index * 200,
        };
        templates.push(transitionTemplate);
      });

      return [templates];
    }
  }

  return [];
};

export default createAnimationTemplates;
