import { pipe } from "ramda";

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

const arraysShareItems = (a: any[], b: any[]) => a.map(i => b.includes(i)).includes(true);

const arrayExistsIn3dArray = (twoD: any[], threeD: any[][]) => threeD.find(currArray => arraysShareItems(twoD, currArray));

const filterOutDuplicates = (cardGroups: CardGroup[]) => {
  let accumulator: CardGroup[] = [];
  cardGroups.forEach(currCardGroup => {
    if (!arrayExistsIn3dArray(currCardGroup, accumulator)) accumulator.push(currCardGroup);
  });
  return accumulator;
};

export const getCardGroupObjs = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroupObj[] =>
  pipe(getCardGroupsArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);

const mapSizes = (cardGroups: CardGroupObj[]): number[] => cardGroups.map(e => e.size);

const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

const cumulativeSum = (sum: number) => (value: number) => (sum += value);

const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);


const curriedGetCardRowShape = (sourceIndex: number) => (cardGroups: CardGroupObj[]) =>
  pipe(mapSizes, removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(cardGroups);

export const getCardRowShapeOnRearrange = (cardGroups: CardGroupObj[], sourceIndex: number) => curriedGetCardRowShape(sourceIndex)(cardGroups);

export const getCardRowShapeOnDraggedOver = (cardGroups: CardGroupObj[]) => pipe(mapSizes, addZeroAtFirstIndex, getCumulativeSum)(cardGroups);


// const compose = (x: any) => (f: any, g: any) => f(g(x));

// const pipeCustom = (x: any) => (f: any, g: any) => g(f(x));
