import { pipe } from "ramda";
import { GCZCards } from "../createGameSnapshot/sampleCards";
import { filterOutDuplicates } from "./genericFunctions";

// TODO: currently passing the id of the first card in the cardGrouObj
const createCardGroupObj = (cardGroupObj: GameCard[]) => ({
  id: cardGroupObj[0].id,//`cardGroup${cardGroupObj[0].name}`,
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
      const newCardGroupObj: NewCardGroupObj = createCardGroupObj(newCardGroup);
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

const convertArraysToObjs = (cardGroups: GameCard[][]): NewCardGroupObj[] => cardGroups.map(c => createCardGroupObj(c))

export const getCardGroupObjsAlt = (GCZCards: GameCard[]): NewCardGroupObj[] => pipe(getCardGroups, filterOutDuplicates, convertArraysToObjs)(GCZCards)

export const getGCZTotalWidth = (GCZCards: GameCard[]) =>
  GCZCards.filter(card => card.cardType === "guest")
    .map(c => 1)
    .reduce((acc: number, curr) => acc + curr, 0);

export const getGCZNumElementsAt = (GCZCards: GameCard[]) => "a"; //GCZCards.map(e => )

const getGCZWidthMapFromObjs = (GCZCardObjs: NewCardGroupObj[]) => GCZCardObjs.map(cardGroup => cardGroup.width);
