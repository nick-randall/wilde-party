import { v4 as uuidv4 } from "uuid";
import { findSnapshotDifferences } from "./findSnapshotDifferences";
import { changeGroupStatus } from "./handleEndAnimation";

export type SnapshotUpdateSource = "localUser" | "server";

const createAnimationTemplates = (
  currSnapshot: GameSnapshot,
  newSnapshot: GameSnapshot,
  snapshotUpdateSource: SnapshotUpdateSource
): AnimationTemplate[][] => {
  const snapshotDifferences = findSnapshotDifferences(currSnapshot, newSnapshot);
  const animationTemplates = createAnimationTemplatesFromSnapshotDifferences(
    snapshotDifferences,
    newSnapshot.snapshotUpdateType,
    snapshotUpdateSource
  );
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
const createAnimationTemplatesFromSnapshotDifferences = (
  differences: SnapshotDifference[],
  snapshotUpdateType: SnapshotUpdateType,
  snapshotUpdateSource: SnapshotUpdateSource
): AnimationTemplate[][] => {
  let templateGroups = returnAnimationTemplates(differences, snapshotUpdateType);

  /** If the user played a card to change the gameSnapshot, removes the initial transition,
  where the card transitions from the players' hand to the card's target location.
  This is necessary because the user has already dragged the card to its target location. 
  */
  if (snapshotUpdateSource === "localUser") {
    //TODO weird code, havven't i handled this better somewhere??
    if (templateGroups.length < 2) {
      return [];
    }
    const updatedTemplateGroups = changeGroupStatus("awaitingEmissaryData", templateGroups[1]);
    templateGroups = [updatedTemplateGroups, ...templateGroups.slice(1)];
  }
  return templateGroups;
};

const returnAnimationTemplates = (differences: SnapshotDifference[], snapshotUpdateType: SnapshotUpdateType): AnimationTemplate[][] => {
  switch (snapshotUpdateType) {
    case "addDragged": {
      let transitionTemplate: AnimationTemplate = {
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

        let handCardFliesToDestroyedCard: AnimationTemplate = {} as AnimationTemplate;
        let handCardFliesToDiscardPile: AnimationTemplate = {} as AnimationTemplate;
        let destroyedCardFliesToDiscardPile: AnimationTemplate = {} as AnimationTemplate;
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
      const transitionTemplate: AnimationTemplate = {
        ...differences[0],
        animation: "flip",
        id: uuidv4(),
        status: "awaitingEmissaryData",
      };
      return [[transitionTemplate]];
    }
    case "dealingCards": {
      const templates: AnimationTemplate[] = [];
      differences.forEach((difference, index) => {
        const transitionTemplate: AnimationTemplate = {
          ...difference,
          animation: difference.to.player === 0 ? "flip" : "",
          id: uuidv4(),
          status: "awaitingEmissaryData",
          // Just adds a 300ms delay to each card dealt (after the first) 
          delay: (differences.length - 1) * 300 - index * 300,
        };
        templates.push(transitionTemplate);
      });

      return [templates];
    }
  }

  return [];
};

export default createAnimationTemplates;
