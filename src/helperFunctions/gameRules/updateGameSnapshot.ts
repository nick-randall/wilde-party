import { locate } from "../locateFunctions";
import { produce } from "immer";
import { getCardGroupObjs, getCardGroupObjsFromSnapshot } from "../groupGCZCards";
import * as R from "ramda";
import { getIdListObject } from "../getIdList";
import { compareProps } from "../tests";

const addDraggedCard = (draggedCard: GameCard, placeId: string, index: number, gameSnapshot: GameSnapshot) => {
  const { place, player } = locate(placeId, gameSnapshot);
};

const removeFromHand = (draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  produce((baseState, draft: GameSnapshot) => {
    draft.players[0].places.hand.cards.splice(draft.players[0].places.hand.cards.indexOf(draggedCard), 1);
  });

export const removeFromGCZ = (draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  produce(gameSnapshot, draft => {
    const splicedCard = draft.players[0].places.GCZ.cards.splice(gameSnapshot.players[0].places.GCZ.cards.indexOf(draggedCard), 1);
    draft.players[0].places.GCZ.cards.forEach((card, index) => (card.index = index));
    /// temporary: put it somewhere to stop error can't find it...
    draft.players[0].places.hand.cards.push(splicedCard[0]);
  });

export const onlyUnique = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};

export const updateRearrange = (draggedCards: GameCard[], draggedOverIndex: number, indexOffset: number, gameSnapshot: GameSnapshot) =>
  produce(gameSnapshot, draft => {
    const startIndex = Math.max(...draggedCards.map(card => card.index));
    const stopIndex = Math.min(...draggedCards.map(card => card.index));
    const places = draggedCards.map(card => card.placeId).filter(onlyUnique);
    places.forEach(placeId => {
      const { place: placeType } = locate(placeId, gameSnapshot);
      const splicedCards = draft.players[0].places[placeType].cards.splice(stopIndex, startIndex - stopIndex + 1);
      draft.players[0].places[placeType].cards.splice(draggedOverIndex + indexOffset, 0, ...splicedCards);
      draft.players[0].places[placeType].cards.forEach((card, index) => (card.index = index));
    });

    // draggedCards.forEach((draggedCard) => {
    //   const { place } = locate(draggedCard.placeId, gameSnapshot);
    //   const splicedCards = draft.players[0].places[place].cards.splice(draggedCard.index, 1);
    //   //console.log(splicedCards[0].image, splicedCards[0].index);

    //   draft.players[0].places[place].cards.splice(draggedOverIndex, 0, splicedCards[0]);

    // });
  });

const changeCardIndex = (card: GameCard, change: number) => {
  let cardCopy = { ...card };
  cardCopy.index = card.index += change;
  return card;
};
export const rearrangeCards = (cardGroup: CardGroupObj, indexChange: number, gameSnapshot: GameSnapshot) =>
  cardGroup.cards.map(c => changeCardIndex(c, indexChange));

const extractCards = (cardGroups: CardGroupObj[]) => cardGroups.map(g => g.cards);

const filterByPlace = (cardGroup: CardGroupObj, placeId: string): CardGroupObj => ({
  ...cardGroup,
  cards: cardGroup.cards.filter(card => card.placeId === placeId),
});

const filterAllByPlace = (placeId: string) => (cardGroups: CardGroupObj[]) => cardGroups.map(g => filterByPlace(g, placeId));

const assignNewIndexes = (cardGroups: CardGroup[]) =>
  cardGroups.map((cardGroup, index) => cardGroup.map((card, index2) => ({ ...card, index: index + index2 })));

const curriedNormalizePlaceCardsFromSnapshot = (gameSnapshot: GameSnapshot) => (placeId: string) =>
  R.pipe(getCardGroupObjsFromSnapshot, filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(gameSnapshot);

export const normalizePlaceCards = (gameSnapshot: GameSnapshot, placeId: string) => curriedNormalizePlaceCardsFromSnapshot(gameSnapshot)(placeId);

// const retrievePlaceIds = (array: GameCard[]) => array.map(e => e.placeId).filter(onlyUnique);

// const getPlaceIdsFromCardGroups = (cardGroups: CardGroupObj[]): string[] => R.pipe(extractCards, R.flatten, retrievePlaceIds)(cardGroups);

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
    // const splicedCard =  array.splice(array.indexOf(array.map((e: any) => e.id)), 1)
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

export const updateGCZAfterRearrange = (gameSnapshot: GameSnapshot, currIndex: number, newIndex: number) =>
  partiallyAppliedUpdateAfterGCZRearrange(currIndex, newIndex)(gameSnapshot);

const moveItem = (currIndex: number, newIndex: number, array: any) => {
  const splicedCard = array.splice(currIndex, 1);
  array.splice(newIndex, 0, splicedCard);
  return array;
};

export const rearrange = (currIndex: number, newIndex: number, gameSnapshot: GameSnapshot) =>
  R.pipe(getCardGroupObjsFromSnapshot, moveItem(currIndex, newIndex, gameSnapshot))(gameSnapshot);


function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const addDragged = (gameSnapshot: GameSnapshot, sourceIndex: number, destinationPlaceId: string, destinationIndex: number): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player, place } = locate(destinationPlaceId, gameSnapshot);
    if (player !== null) {
        // this just changes playerid to 0!
      setAttributes(draft.players[0].places.hand.cards[sourceIndex], { placeId: destinationPlaceId, playerId: player, index: destinationIndex });
      const [handCard] = draft.players[0].places.hand.cards.splice(sourceIndex, 1);
      draft.players[player].places[place].cards.splice(destinationIndex, 0, handCard);
      compareProps(draft.players[0].places.GCZ.cards);
    }
  });
