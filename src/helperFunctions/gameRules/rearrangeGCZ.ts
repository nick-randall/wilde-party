import { getCardGroupObjsFromSnapshot } from "../groupGCZCards";
import * as R from "ramda";
import { getIdListObject } from "../getIdList";


const extractCards = (cardGroups: CardGroupObj[]) => cardGroups.map(g => g.cards);

const filterByPlace = (cardGroup: CardGroupObj, placeId: string): CardGroupObj => ({
  ...cardGroup,
  cards: cardGroup.cards.filter(card => card.placeId === placeId),
});

const filterAllByPlace = (placeId: string) => (cardGroups: CardGroupObj[]) => cardGroups.map(g => filterByPlace(g, placeId));

const assignNewIndexes = (cardGroups: CardGroup[]) =>
  cardGroups.map((cardGroup, index) => cardGroup.map((card, index2) => ({ ...card, index: index + index2 })));

// const curriedNormalizePlaceCardsFromSnapshot = (gameSnapshot: GameSnapshot) => (placeId: string) =>
//   R.pipe(getCardGroupObjsFromSnapshot, filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(gameSnapshot);

// export const normalizePlaceCards = (gameSnapshot: GameSnapshot, placeId: string) => curriedNormalizePlaceCardsFromSnapshot(gameSnapshot)(placeId);

const normalizePlaceCardsFromCardGroups = (cardGroups: CardGroupObj[], placeId: string) =>
  R.pipe(filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(cardGroups);

const curriedReturnNormalizedCardGroups = (gameSnapshot: GameSnapshot) => (cardGroups: CardGroupObj[]) => {
  const { pl0GCZ, pl0enchantmentsRow } = getIdListObject(gameSnapshot);
  return {
    updatedGCZCards: normalizePlaceCardsFromCardGroups(cardGroups, pl0GCZ),
    updatedEnchantmentsRowCards: normalizePlaceCardsFromCardGroups(cardGroups, pl0enchantmentsRow),
  };
};

const curriedMoveCardGroup =
  (currIndex: number, newIndex: number) =>
  (array: CardGroupObj[]): CardGroupObj[] => {
    const [splicedCard] = array.splice(currIndex, 1);
    array.splice(newIndex, 0, splicedCard);
    return array;
  };

const curriedUpdateGameSnapshotWithNewGCZAndEnchant =
  (gameSnapshot: GameSnapshot) =>
  ({ updatedGCZCards, updatedEnchantmentsRowCards }: { updatedGCZCards: GameCard[]; updatedEnchantmentsRowCards: GameCard[] }) => {
    const enchantCards = R.lensPath(["players", 0, "places", "enchantmentsRow", "cards"]);
    const snapshotWithUpdatedEnchantCards = R.set(enchantCards, updatedEnchantmentsRowCards, gameSnapshot);
    const GCZCards = R.lensPath(["players", 0, "places", "GCZ", "cards"]);
    const snapshotwithBothUpdated = R.set(GCZCards, updatedGCZCards, snapshotWithUpdatedEnchantCards);
    return snapshotwithBothUpdated;
  };

const partiallyAppliedUpdateAfterGCZRearrange = (currIndex: number, newIndex: number) => (gameSnapshot: GameSnapshot) =>
  R.pipe(
    getCardGroupObjsFromSnapshot,
    curriedMoveCardGroup(currIndex, newIndex),
    curriedReturnNormalizedCardGroups(gameSnapshot),
    curriedUpdateGameSnapshotWithNewGCZAndEnchant(gameSnapshot)
  )(gameSnapshot);

export const rearrangeGCZ = (gameSnapshot: GameSnapshot, currIndex: number, newIndex: number) =>
  partiallyAppliedUpdateAfterGCZRearrange(currIndex, newIndex)(gameSnapshot);

const moveItem = (currIndex: number, newIndex: number, array: any) => {
  const splicedCard = array.splice(currIndex, 1);
  array.splice(newIndex, 0, splicedCard);
  return array;
};

export const rearrange = (currIndex: number, newIndex: number, gameSnapshot: GameSnapshot) =>
  R.pipe(getCardGroupObjsFromSnapshot, moveItem(currIndex, newIndex, gameSnapshot))(gameSnapshot);


