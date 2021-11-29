import { pipe } from "ramda";
import { filterOutDuplicates } from "./genericFunctions";

const getCardGroupsArray = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroup[] =>
  GCZCards.map((card, index) =>
    !enchantmentsCards.find(cardB => cardB.index === index)
      ? [card]
      : enchantmentsCards.filter(cardB => cardB.index === index && cardB.cardType === "bff").length > 0
      ? [card, GCZCards[index + 1], enchantmentsCards.filter(cardB => cardB.index === index)[0]]
      : [card, enchantmentsCards.filter(cardB => cardB.index === index)[0]]
  );

const convertCardGroupToObj = (cardGroupArray: CardGroup[]): CardGroupObj[] =>
  cardGroupArray.map(cardGroup => ({ id: `cardGroup${cardGroup[0].name}`, size: cardGroup.length < 3 ? 1 : 2, cards: cardGroup }));

export const getCardGroupObjs = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroupObj[] =>
  pipe(getCardGroupsArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);

export const mapSizes = (cardGroups: CardGroupObj[]): number[] => cardGroups.map(e => e.size);

const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

const cumulativeSum = (sum: number) => (value: number) => (sum += value);

export const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

export const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

const curriedGetCardRowShape = (sourceIndex: number) => (cardGroups: CardGroupObj[]) =>
  pipe(mapSizes, removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(cardGroups);

export const getCardRowShapeOnRearrange = (cardGroups: CardGroupObj[], sourceIndex: number) => curriedGetCardRowShape(sourceIndex)(cardGroups);

//
//
const getCardGroupsArrayFromSnapshot = ({ enchantmentsCards, GCZCards }: { enchantmentsCards: GameCard[]; GCZCards: GameCard[] }): CardGroup[] =>
  GCZCards.map((card, index) =>
    !enchantmentsCards.find(cardB => cardB.index === index)
      ? [card]
      : enchantmentsCards.filter(cardB => cardB.index === index && cardB.cardType === "bff").length > 0
      ? [card, GCZCards[index + 1], enchantmentsCards.filter(cardB => cardB.index === index)[0]]
      : [card, enchantmentsCards.filter(cardB => cardB.index === index)[0]]
  );

export const getGCZAndEnchantRowFromSnapshot = (gameSnapshot: GameSnapshot) => ({
  GCZCards: gameSnapshot.players[0].places.GCZ.cards,
  enchantmentsCards: gameSnapshot.players[0].places.enchantmentsRow.cards,
});

const getCardGroupObjsFromGCZAndEnchantRow = ({
  enchantmentsCards,
  GCZCards,
}: {
  enchantmentsCards: GameCard[];
  GCZCards: GameCard[];
}): CardGroupObj[] => pipe(getCardGroupsArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);

export const getCardGroupObjsFromSnapshot = (gameSnapshot: GameSnapshot): CardGroupObj[] =>
  pipe(getGCZAndEnchantRowFromSnapshot, getCardGroupsArrayFromSnapshot, filterOutDuplicates, convertCardGroupToObj)(gameSnapshot);

const curriedGetCardRowShapeFromSnapshot = (sourceIndex: number) => (gameSnapshot: GameSnapshot) =>
  pipe(
    getGCZAndEnchantRowFromSnapshot,
    getCardGroupObjsFromGCZAndEnchantRow,
    mapSizes,
    removeSourceIndex(sourceIndex),
    addZeroAtFirstIndex,
    getCumulativeSum
  )(gameSnapshot);


const getCardRowShapeFromSnapshot = (gameSnapshot: GameSnapshot, sourceIndex: number) => curriedGetCardRowShapeFromSnapshot(sourceIndex)(gameSnapshot);

export const getCardRowAndShape = (gameSnapshot: GameSnapshot, sourceIndex: number) => ({
  GCZRow: getCardGroupObjsFromSnapshot(gameSnapshot),
  shape: getCardRowShapeFromSnapshot(gameSnapshot, sourceIndex),
});

export const getCardRowShapeOnDraggedOver = (cardGroups: CardGroupObj[]) => pipe(mapSizes, addZeroAtFirstIndex, getCumulativeSum)(cardGroups);

// const compose = (x: any) => (f: any, g: any) => f(g(x));

// const pipeCustom = (x: any) => (f: any, g: any) => g(f(x));
