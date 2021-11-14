import { pipe } from "ramda";

const convertCardGroupToObj = (cardGroupArray: CardGroup[]): CardGroupObj[] =>
  cardGroupArray.map((CardGroup) => ({ id: `cardGroup${CardGroup[0].name}`, size: CardGroup.length < 3 ? 1 : 2, cards: CardGroup, ghost: false }));

const filterOutDuplicates = (cardGroups: CardGroup[]) => {
  let accCardGroups: CardGroup[] = [];
  cardGroups.forEach((currGroup) => {
    for (const currCard of currGroup) {
      if (!accCardGroups.find((prevArray) => prevArray.map((prevCard) => prevCard.id).includes(currCard.id))) accCardGroups.push(currGroup);
    }
  });
  return accCardGroups;
};

export const getCardGroupArray = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroup[] =>
  GCZCards.map((card, index) =>
    !enchantmentsCards.find((cardB) => cardB.index === index)
      ? [card]
      : enchantmentsCards.filter((cardB) => cardB.index === index && cardB.cardType === "bff").length > 0
      ? [card, GCZCards[index + 1], enchantmentsCards.filter((cardB) => cardB.index === index)[0]]
      : [card, enchantmentsCards.filter((cardB) => cardB.index === index)[0]]
  );
export const getCardGroupsShape = (enchantmentsCards: GameCard[], GCZCards: GameCard[]) => getCardGroupObjs(enchantmentsCards, GCZCards).map((e) => e.size).map(cumulativeSum)

export const getCardGroupObjs = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroupObj[] =>
  pipe(getCardGroupArray, filterOutDuplicates, convertCardGroupToObj)(enchantmentsCards, GCZCards);

interface CardGroupData {
  cardGroupObjs: CardGroupObj[],
  cardGroupsShape: number[],
}

export const getCardGroupData = (enchantmentsCards: GameCard[], GCZCards: GameCard[]): CardGroupData => ({
  cardGroupObjs: getCardGroupObjs(enchantmentsCards, GCZCards),
  cardGroupsShape: getCardGroupsShape(enchantmentsCards, GCZCards)
})


const cumulativeSum = (
  (sum) => (value: number) =>
    (sum += value)
)(0);
