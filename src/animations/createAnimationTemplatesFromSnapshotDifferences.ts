import { v4 as uuidv4 } from "uuid";
import { findSnapshotDifferences } from "./findSnapshotDifferences";
import { changeGroupStatus } from "./handleEndAnimation";
import { delay } from "./transitionSpeeds";

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
    const updatedTemplateGroups = changeGroupStatus("awaitingScreenData", templateGroups[1]);
    templateGroups = [updatedTemplateGroups, ...templateGroups.slice(1)];
  }
  return templateGroups;
};

const returnAnimationTemplates = (differences: SnapshotDifference[], snapshotUpdateType: SnapshotUpdateType): AnimationTemplate[][] => {
  console.log(snapshotUpdateType);
  switch (snapshotUpdateType) {
    case "addDragged": {
      let animationTemplate: AnimationTemplate = {
        ...differences[0],
        animationType: "deckToHand",
        status: "awaitingScreenData",
        id: uuidv4(),
      };
      return [[animationTemplate]];
    }
    // case "rearrangingHand":
    //   break;
    // return "rearrangingHand";
    case "destroy": {
      const destroyedCardChangeData: SnapshotDifference | undefined = differences.find(change => change.from.place === "GCZ");
      const handCardChangeData: SnapshotDifference | undefined = differences.find(change => change.from.place === "hand");
      if (destroyedCardChangeData && handCardChangeData) {
        const awaitsId = uuidv4();
        const destroyedCardId = destroyedCardChangeData.cardId;

        // create two differences with orderOfExecution 0 and 1
        const handCardFliesToDestroyedCard = { ...handCardChangeData, targetId: destroyedCardId, id: uuidv4(), status: "awaitingScreenData" };
        const handCardFliesToDiscardPileViaDestroyedCard : AnimationTemplate = {
          ...handCardChangeData,
          intermediateSteps: [handCardFliesToDestroyedCard],
          id: awaitsId,
          animationType: "handToTable",
          status: "awaitingScreenData",
        };

        const destroyedCardFliesToDiscardPile: AnimationTemplate = {
          ...destroyedCardChangeData,
          id: uuidv4(),
          animationType: "tableToDiscardPile",
          status: "awaitingScreenData",
          awaits: awaitsId
        };

        return [
          // [handCardFliesToDestroyedCard],
          [handCardFliesToDiscardPileViaDestroyedCard, destroyedCardFliesToDiscardPile],
        ];
      }
      return [];
    }
    case "rearrangingTablePlace": {
      return [
        [...differences].map((difference, index) => ({
          ...difference,
          animationType: "deckToHand",
          id: uuidv4(),
          status: "awaitingScreenData",
          // Just adds a 300ms delay to each card dealt (after the first)
          // delay: (differences.length - 1) * delay.veryShort - index * delay.veryShort,
          delay: index === 0 ? 0 : delay.short,
          intermediateSteps: [],
        })),
      ];
    }
    // case "steal":
    // case "swap":
    // case "enchant":
    // case "protectSelf":
    // case "drawingWildeParty":
    // case "initialSnapshot":
    case "dealingInitialCards": {
      const transitionTemplate: AnimationTemplate = {
        ...differences[0],
        animationType: "deckToHand",
        id: uuidv4(),
        status: "awaitingScreenData",
      };
      return [[transitionTemplate]];
    }
    case "dealingCards": {
      return [
        differences.map((difference, index) => ({
          ...difference,
          animationType: "deckToHand",
          id: uuidv4(),
          status: "awaitingScreenData",
          // Just adds a 300ms delay to each card dealt (after the first)
          delay: (differences.length - 1) * delay.veryShort - index * delay.veryShort,
          intermediateSteps: [],
        })),
      ];
    }
  }

  return [];
};

export default createAnimationTemplates;
