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

const normalizePlaceCards = (cardGroups: CardGroupObj[], placeId: string) =>
  R.pipe(filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(cardGroups);

const curriedNormalizeCardGroups = (gameSnapshot: GameSnapshot) => (cardGroups: CardGroupObj[]) => {
  const { pl0GCZ, pl0enchantmentsRow } = getIdListObject(gameSnapshot);
  return {
    updatedGCZCards: normalizePlaceCards(cardGroups, pl0GCZ),
    updatedEnchantmentsRowCards: normalizePlaceCards(cardGroups, pl0enchantmentsRow),
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
    curriedNormalizeCardGroups(gameSnapshot),
    curriedUpdateGCZAndEnchant(gameSnapshot)
  )(gameSnapshot);

export const rearrangeGCZ = (gameSnapshot: GameSnapshot, currIndex: number, newIndex: number) =>
  partiallyAppliedRearrangeGCZ(currIndex, newIndex)(gameSnapshot);