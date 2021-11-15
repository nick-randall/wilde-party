import { pipe } from "ramda";

const getCardGroupArray = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroup[] =>
  GCZCards.map((card, index) =>
    !enchantmentsCards.find(cardB => cardB.index === index)
      ? [card]
      : enchantmentsCards.filter(cardB => cardB.index === index && cardB.cardType === "bff").length > 0
      ? [card, GCZCards[index + 1], enchantmentsCards.filter(cardB => cardB.index === index)[0]]
      : [card, enchantmentsCards.filter(cardB => cardB.index === index)[0]]
  );

const convertCardGroupToObj = (cardGroupArray: CardGroup[]): CardGroupObj[] =>
  cardGroupArray.map(CardGroup => ({ id: `cardGroup${CardGroup[0].name}`, size: CardGroup.length < 3 ? 1 : 2, cards: CardGroup, ghost: false }));

const filterOutDuplicates = (cardGroups: CardGroup[]) => {
  let accCardGroups: CardGroup[] = [];
  cardGroups.forEach(currGroup => {
    for (const currCard of currGroup) {
      if (!accCardGroups.find(prevArray => prevArray.map(prevCard => prevCard.id).includes(currCard.id))) accCardGroups.push(currGroup);
    }
  });
  return accCardGroups;
};

export const getCardGroupObjs = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroupObj[] =>
  pipe(getCardGroupArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);


  
const mapToSizes = (cardGroups: CardGroupObj[]): number[] => cardGroups.map(e => e.size);

const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

const cumulativeSum = (sum: number) => (value: number) => (sum += value);

const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

const addFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

const curriedGetCardRowShape = (sourceIndex: number) => (cardGroups: CardGroupObj[]) => pipe(mapToSizes, removeSourceIndex(sourceIndex), addFirstIndex, getCumulativeSum)(cardGroups)

export const getCardRowShapeOnRearrange = (cardGroups: CardGroupObj[], sourceIndex: number) => (curriedGetCardRowShape(sourceIndex)(cardGroups))

const compose = (x: any) => (f : any, g: any) => f(g(x))

const pipeCustom  = (x: any) => (f : any, g: any) => g(f(x))
