const createCardGroupObj = (cardGroupObj: GameCard[]) => ({
  id: `cardGroup${cardGroupObj[0].name}`,
  width: cardGroupObj.length === 1 ? 1 : cardGroupObj.length - 1,
  size: cardGroupObj.length,
  cards: cardGroupObj,
});

const isBff = (card?: GameCard) => card && card.cardType === "bff";

const isZwilling = (card?: GameCard) => card && card.cardType === "zwilling";

const isGuestCard = (card?: GameCard) => card && card.cardType === "guest";

export const getCardGroupsObjsnew = (GCZCards: GameCard[]): NewCardGroupObj[] => {
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

export const getGCZTotalWidth = (GCZCards: GameCard[]) =>
  GCZCards.filter(card => card.cardType === "guest")
    .map(c => 1)
    .reduce((acc: number, curr) => acc + curr, 0);

export const getGCZNumElementsAt = (GCZCards: GameCard[]) => "a"; //GCZCards.map(e => )

const getGCZWidthMapFromObjs = (GCZCardObjs: NewCardGroupObj[]) => GCZCardObjs.map(cardGroup => cardGroup.width);
