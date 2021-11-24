import { locate } from "../locateFunctions";
import { produce } from "immer";
import { getCardGroupObjs, getCardGroupObjsFromSnapshot } from "../groupGCZCards";
import * as R from "ramda"

const addDraggedCard = (draggedCard: GameCard, placeId: string, index: number, gameSnapshot: GameSnapshot) => {
  const { place, player } = locate(placeId, gameSnapshot);
};

const removeFromHand = (draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  produce((baseState, draft: GameSnapshot) => {
    draft.players[0].places.hand.cards.splice(draft.players[0].places.hand.cards.indexOf(draggedCard), 1);
  });

export const removeFromGCZ = (draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  produce(gameSnapshot, (draft) => {
    const splicedCard = draft.players[0].places.GCZ.cards.splice(gameSnapshot.players[0].places.GCZ.cards.indexOf(draggedCard), 1);
    draft.players[0].places.GCZ.cards.forEach((card, index) => (card.index = index));
    /// temporary: put it somewhere to stop error can't find it...
    draft.players[0].places.hand.cards.push(splicedCard[0]);
  });

export const onlyUnique = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};

export const updateRearrange = (draggedCards: GameCard[], draggedOverIndex: number, indexOffset: number, gameSnapshot: GameSnapshot) =>
  produce(gameSnapshot, (draft) => {
     const startIndex = Math.max(...draggedCards.map((card) => card.index))  
     const stopIndex = Math.min(...draggedCards.map((card) => card.index));
     const places = draggedCards.map((card) => card.placeId).filter(onlyUnique);
    places.forEach((placeId) => {
      const { place: placeType } = locate(placeId, gameSnapshot);
      const splicedCards = draft.players[0].places[placeType].cards.splice(stopIndex , startIndex - stopIndex + 1); 
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
  }
export const rearrangeCards = (cardGroup: CardGroupObj, indexChange: number, gameSnapshot: GameSnapshot) => cardGroup.cards.map(c => changeCardIndex(c, indexChange))

const extractCards = (cardGroups: CardGroupObj[]) => (cardGroups.map(g => g.cards));

const filterByPlace = (cardGroup: CardGroupObj, placeId: string): CardGroupObj => ({...cardGroup, cards: cardGroup.cards.filter(card => card.placeId === placeId)})

const filterAllByPlace = (placeId: string) => (cardGroups: CardGroupObj[]) => cardGroups.map(g => filterByPlace(g, placeId))

const assignNewIndexes = (cardGroups: CardGroup[]) => cardGroups.map((cardGroup, index) => cardGroup.map((card, index2) => ({...card, index : index + index2})))

const curriedNormalizePlaceCards = (gameSnapshot: GameSnapshot) => (placeId: string) => R.pipe(getCardGroupObjsFromSnapshot, filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(gameSnapshot)

export const normalizePlaceCards = (gameSnapshot: GameSnapshot, placeId: string) => curriedNormalizePlaceCards(gameSnapshot)(placeId)


// this updates state only
