import { addZeroAtFirstIndex, getCardGroupObjsFromSnapshot, getCumulativeSum, mapSizes } from "../groupGCZCards";
import * as R from "ramda";
import { getIdListObject } from "../getIdList";

const extractCards = (cardGroups: CardGroupObj[]) => cardGroups.map(g => g.cards);

const filterByPlace = (cardGroup: CardGroupObj, placeId: string): CardGroupObj => ({
  ...cardGroup,
  cards: cardGroup.cards.filter(card => card.placeId === placeId),
});

const filterAllByPlace = (placeId: string) => (cardGroups: CardGroupObj[]) => cardGroups.map(g => filterByPlace(g, placeId));

const assignNewIndex = (cardGroup: CardGroup, cardGroupIndex: number, indexArray: number[]): GameCard[] =>
  cardGroup.map((card, index) =>
    index > 0 && card.cardType === "guest" ? { ...card, index: indexArray[cardGroupIndex] + 1 } : { ...card, index: indexArray[cardGroupIndex] }
  );

const assignNewIndexes = (cardGroups: CardGroup[], indexArray: number[]) =>
  cardGroups.map((cardGroup, index) => assignNewIndex(cardGroup, index, indexArray)); //(cardGroup.map((card, index2) => assignNewIndex

const getCardRowShape = (cardGroupObjs: CardGroupObj[]): number[] => R.pipe(mapSizes, addZeroAtFirstIndex, getCumulativeSum)(cardGroupObjs);

const cardGroupsToCardArray = (cardGroupObjs: CardGroupObj[], placeId: string): GameCard[] => {
  const shape = getCardRowShape(cardGroupObjs);
  const cardGroups = R.pipe(filterAllByPlace(placeId), extractCards)(cardGroupObjs);
  const cardArray = R.pipe(assignNewIndexes, R.flatten)(cardGroups, shape);
  return cardArray;
};

// const cardGroupsToCardArray = (cardGroups: CardGroupObj[], placeId: string): GameCard[] =>
//   R.pipe(filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(cardGroups);

const currieCardGroupsToCardArrays = (gameSnapshot: GameSnapshot) => (cardGroups: CardGroupObj[]) => {
  const { pl0GCZ, pl0enchantmentsRow } = getIdListObject(gameSnapshot);
  return {
    updatedGCZCards: cardGroupsToCardArray(cardGroups, pl0GCZ),
    updatedEnchantmentsRowCards: cardGroupsToCardArray(cardGroups, pl0enchantmentsRow),
  };
};

const curriedMoveCardGroup =
  (currIndex: number, newIndex: number) =>
  (array: CardGroupObj[]): CardGroupObj[] => {
    const [splicedCard] = array.splice(currIndex, 1);
    array.splice(newIndex, 0, splicedCard);
    return array;
  };

const curriedUpdateGCZAndEnchant =
  (gameSnapshot: GameSnapshot) =>
  ({ updatedGCZCards, updatedEnchantmentsRowCards }: { updatedGCZCards: GameCard[]; updatedEnchantmentsRowCards: GameCard[] }) => {
    const enchantCards = R.lensPath(["players", 0, "places", "enchantmentsRow", "cards"]);
    const snapshotWithUpdatedEnchantCards = R.set(enchantCards, updatedEnchantmentsRowCards, gameSnapshot);
    const GCZCards = R.lensPath(["players", 0, "places", "GCZ", "cards"]);
    const snapshotwithBothUpdated = R.set(GCZCards, updatedGCZCards, snapshotWithUpdatedEnchantCards);
    return snapshotwithBothUpdated;
  };

const partiallyAppliedRearrangeGCZ = (currIndex: number, newIndex: number) => (gameSnapshot: GameSnapshot) =>
  R.pipe(
    getCardGroupObjsFromSnapshot,
    curriedMoveCardGroup(currIndex, newIndex),
    currieCardGroupsToCardArrays(gameSnapshot),
    curriedUpdateGCZAndEnchant(gameSnapshot)
  )(gameSnapshot);

export const rearrangeGCZ = (gameSnapshot: GameSnapshot, currIndex: number, newIndex: number) =>
  partiallyAppliedRearrangeGCZ(currIndex, newIndex)(gameSnapshot);
