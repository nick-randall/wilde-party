import { v4 as uuidv4 } from "uuid";
import { delay } from "./createKeyframesFromTemplate";
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
  console.log(snapshotUpdateType);
  switch (snapshotUpdateType) {
    case "addDragged": {
      let animationTemplate: AnimationTemplate = {
        ...differences[0],
        animationType: "deckToHand",
        status: "awaitingEmissaryData",
        id: uuidv4(),
      };
      return [[animationTemplate]];
    }
    // case "rearrangingHand":
    //   break;
    // return "rearrangingHand";
    case "destroy": {
      const destroyedCardFromData: ToOrFrom | undefined = differences.find(change => change.from.place === "GCZ")?.from;
      if (destroyedCardFromData) {
        const destroyedCard: Via = { cardId: destroyedCardFromData.cardId, targetId: destroyedCardFromData.cardId };

        let handCardFliesToDiscardPileViaDestroyedCard: AnimationTemplate = {} as AnimationTemplate;
        // let handCardFliesToDiscardPile: AnimationTemplate = {} as AnimationTemplate;
        let destroyedCardFliesToDiscardPile: AnimationTemplate = {} as AnimationTemplate;
        differences.forEach(change => {
          if (change.from.place === "hand") {
            // create two differences with orderOfExecution 0 and 1
            // handCardFliesToDestroyedCard = { ...change, to: destroyedCard, id: uuidv4(), status: "awaitingEmissaryData" };
            handCardFliesToDiscardPileViaDestroyedCard = {
              ...change,
              via: destroyedCard,
              id: uuidv4(),
              animationType: "handToTable",
              status: "awaitingEmissaryData",
            };
          }
          if (change.from.place === "GCZ") {
            destroyedCardFliesToDiscardPile = { ...change, id: uuidv4(), animationType: "tableToDiscardPile", status: "awaitingEmissaryData" };
          }
        });
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
          status: "awaitingEmissaryData",
          // Just adds a 300ms delay to each card dealt (after the first)
          // delay: (differences.length - 1) * delay.veryShort - index * delay.veryShort,
          delay: index === 0 ? 0 : delay.short,
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
        status: "awaitingEmissaryData",
      };
      return [[transitionTemplate]];
    }
    case "dealingCards": {
      return [
        differences.map((difference, index) => ({
          ...difference,
          animationType: "deckToHand",
          id: uuidv4(),
          status: "awaitingEmissaryData",
          // Just adds a 300ms delay to each card dealt (after the first)
          delay: (differences.length - 1) * delay.veryShort - index * delay.veryShort,
        })),
      ];
    }
  }

  return [];
};

export default createAnimationTemplates;
