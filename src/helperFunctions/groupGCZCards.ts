import { pipe } from "ramda";
import { filterOutDuplicates } from "./genericFunctions";

// TODO cleanup!!!

// const getCardGroupsArray = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroup[] =>
//   GCZCards.map((card, index) =>
//     !enchantmentsCards.find(cardB => cardB.index === index)
//       ? [card]
//       : enchantmentsCards.filter(cardB => cardB.index === index && cardB.cardType === "bff").length > 0
//       ? [card, GCZCards[index + 1], enchantmentsCards.filter(cardB => cardB.index === index)[0]]
//       : [card, enchantmentsCards.filter(cardB => cardB.index === index)[0]]
//   );

// const convertCardGroupToObj = (cardGroupArray: CardGroup[]): CardGroupObj[] =>
//   cardGroupArray.map(cardGroup => ({ id: cardGroup[0].id, size: cardGroup.length < 3 ? 1 : 2, cards: cardGroup }));

// export const getCardGroupObjs = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroupObj[] =>
//   pipe(getCardGroupsArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);

// export const mapSizes = (cardGroups: CardGroupObj[]): number[] => cardGroups.map(e => e.size);

// const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

// const cumulativeSum = (sum: number) => (value: number) => (sum += value);

// export const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

// export const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

// const curriedGetCardRowShape = (sourceIndex: number) => (cardGroups: CardGroupObj[]) =>
//   pipe(mapSizes, removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(cardGroups);

// export const getCardRowShapeOnRearrange = (cardGroups: CardGroupObj[], sourceIndex: number) => curriedGetCardRowShape(sourceIndex)(cardGroups);

// //
// //
// const getCardGroupsArrayFromSnapshot = ({ enchantmentsCards, GCZCards }: { enchantmentsCards: GameCard[]; GCZCards: GameCard[] }): CardGroup[] =>
//   GCZCards.map((card, index) =>
//     !enchantmentsCards.find(cardB => cardB.index === index)
//       ? [card]
//       : enchantmentsCards.filter(cardB => cardB.index === index && cardB.cardType === "bff").length > 0
//       ? [card, GCZCards[index + 1], enchantmentsCards.filter(cardB => cardB.index === index)[0]]
//       : [card, enchantmentsCards.filter(cardB => cardB.index === index)[0]]
//   );

// export const getGCZAndEnchantRowFromSnapshot = (gameSnapshot: GameSnapshot) => ({
//   GCZCards: gameSnapshot.players[0].places.GCZ.cards,
//   enchantmentsCards: gameSnapshot.players[0].places.enchantmentsRow.cards,
// });

// const getCardGroupObjsFromGCZAndEnchantRow = ({
//   enchantmentsCards,
//   GCZCards,
// }: {
//   enchantmentsCards: GameCard[];
//   GCZCards: GameCard[];
// }): CardGroupObj[] => pipe(getCardGroupsArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);

// export const getCardGroupObjsFromSnapshot = (gameSnapshot: GameSnapshot): CardGroupObj[] =>
//   pipe(getGCZAndEnchantRowFromSnapshot, getCardGroupsArrayFromSnapshot, filterOutDuplicates, convertCardGroupToObj)(gameSnapshot);

// const curriedGetCardRowShapeFromSnapshot = (sourceIndex: number) => (gameSnapshot: GameSnapshot) =>
//   pipe(
//     getGCZAndEnchantRowFromSnapshot,
//     getCardGroupObjsFromGCZAndEnchantRow,
//     mapSizes,
//     removeSourceIndex(sourceIndex),
//     addZeroAtFirstIndex,
//     getCumulativeSum
//   )(gameSnapshot);


// const getCardRowShapeFromSnapshot = (gameSnapshot: GameSnapshot, sourceIndex: number) => curriedGetCardRowShapeFromSnapshot(sourceIndex)(gameSnapshot);

// export const getCardRowAndShape = (gameSnapshot: GameSnapshot, sourceIndex: number) => ({
//   GCZRow: getCardGroupObjsFromSnapshot(gameSnapshot),
//   shape: getCardRowShapeFromSnapshot(gameSnapshot, sourceIndex),
// });

// export const getCardRowShapeOnDraggedOver = (cardGroups: CardGroupObj[]) => pipe(mapSizes, addZeroAtFirstIndex, getCumulativeSum)(cardGroups);

// const compose = (x: any) => (f: any, g: any) => f(g(x));

// const pipeCustom = (x: any) => (f: any, g: any) => g(f(x));


// import { pipe } from "ramda";
// import { GCZCards } from "../createGameSnapshot/sampleCards";
// import { filterOutDuplicates } from "./genericFunctions";

const cumulativeSum = (numbers: number[]) =>
  numbers.reduce<number[]>((acc, curr) => (acc.length === 0 ? [curr] : [...acc, acc[acc.length - 1] + curr]), []);

export const getCardRowShapeOnDraggedOver = (cardRow: NewCardGroupObj[]) => {
  // let i = 0;
  // return cardRow.map(cardGroup => {
  //   const cumulativeWidth = i;
  //   i += cardGroup.size;
  //   return cumulativeWidth;
  // });
  const sizes = cardRow.map(cardGroup => cardGroup.size);
  return cumulativeSum(sizes);
};

export const getCardRowShapeOnRearrange = (cardRow: NewCardGroupObj[], sourceIndex: number) => {
  const sizes = cardRow.map(cardGroup => cardGroup.size);
  sizes.splice(sourceIndex, 1);
  sizes.unshift(0);
  return cumulativeSum(sizes);
  //   pipe(mapSizes, removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(cardGroups);
};

// TODO: currently passing the id of the first card in the cardGrouObj
const createCardGroupObj = (cardGroupObj: GameCard[], index: number): NewCardGroupObj => ({
  id: cardGroupObj[0].id,//`cardGroup${cardGroupObj[0].name}`,
  index: index,
  width: cardGroupObj.length === 1 ? 1 : cardGroupObj.length - 1,
  size: cardGroupObj.length,
  cards: cardGroupObj,
});

const isBff = (card?: GameCard) => card && card.cardType === "bff";

const isZwilling = (card?: GameCard) => card && card.cardType === "zwilling";

const isGuestCard = (card?: GameCard) => card && card.cardType === "guest";

export const getCardGroupsObjs = (GCZCards: GameCard[]): NewCardGroupObj[] => {
  let cardGroupObjs: NewCardGroupObj[] = [];
  for (let i = 0; i < GCZCards.length; i++) {
    let newCardGroup: GameCard[] | undefined;

    const card: GameCard = GCZCards[i];
    const cardToLeft: GameCard | undefined = GCZCards[i - 1];
    const cardToRight: GameCard | undefined = GCZCards[i + 1];
    const cardTwoToRight: GameCard | undefined = GCZCards[i + 2];

    if (isBff(cardToRight)) newCardGroup = [card, cardToRight, cardTwoToRight];
    if (isZwilling(cardToRight)) newCardGroup = [card, cardToRight];
    if (!newCardGroup) {
      if (isGuestCard(card) && !isBff(cardToLeft)) newCardGroup = [card];
    }

    if (newCardGroup) {
      const newCardGroupObj: NewCardGroupObj = createCardGroupObj(newCardGroup, i);
      cardGroupObjs.push(newCardGroupObj);
    }
  }
  return cardGroupObjs; 
};

const cardGroupType: { [cardType: string]: { start: number; length: number } } = {
  bff: { start: -1, length: 3 },
  zwilling: { start: 0, length: 2 },
  guest: { start: 0, length: 1 },
};
interface CardGroupStructure {
  [cardType: string]: number[];
}
const cardToLeft = -1;
const thisCard = 0;
const cardToRight = 1;

const cardGroupStructures: CardGroupStructure = { bff: [cardToLeft, thisCard, cardToRight], zwilling: [cardToLeft, thisCard], guest: [thisCard] };

const getCardGroups = (GCZCards: GameCard[]) =>
  GCZCards.map((card, index) => {
    const cardGroupStructure = cardGroupStructures[card.cardType];
    return GCZCards.slice(index + cardGroupStructure[0], cardGroupStructure.length + cardGroupStructure[0]);
  });

 export type NewCardGroupObj = {
    id: number;
    index: number;
    width: number;
    size: number;
    cards: CardGroup;
  };

// const convertArraysToObjs = (cardGroups: GameCard[][]): NewCardGroupObj[] => cardGroups.map(c => createCardGroupObj(c))

// export const getCardGroupObjsAlt = (GCZCards: GameCard[]): NewCardGroupObj[] => pipe(getCardGroups, filterOutDuplicates, convertArraysToObjs)(GCZCards)

export const getGCZTotalWidth = (GCZCards: GameCard[]) =>
  GCZCards.filter(card => card.cardType === "guest") // can't i just use .length?
    .map(_ => 1)
    .reduce((acc: number, curr) => acc + curr, 0);

export const getGCZNumElementsAt = (GCZCards: GameCard[]) => "a"; //GCZCards.map(e => )

const getGCZWidthMapFromObjs = (GCZCardObjs: NewCardGroupObj[]) => GCZCardObjs.map(cardGroup => cardGroup.width);
