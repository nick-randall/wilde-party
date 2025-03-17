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
  sizes.unshift(0);
  return cumulativeSum(sizes);
};

export const getCardRowShapeOnRearrange = (cardRow: NewCardGroupObj[], sourceIndex: number) => {
  const sizes = cardRow.map(cardGroup => cardGroup.size);
  sizes.splice(sourceIndex, 1);
  sizes.unshift(0);
  return cumulativeSum(sizes);
  //   pipe(mapSizes, removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(cardGroups);
};

export const getWidthShapeOnRearrange = (cardRow: NewCardGroupObj[], sourceIndex: number) => {
  const widths = cardRow.map(cardGroup => cardGroup.width);
  widths.splice(sourceIndex, 1);
  widths.unshift(0);
  return cumulativeSum(widths);
}


// TODO: currently passing the id of the first card in the cardGrouObj
const createCardGroupObj = (cardGroupObj: GameCard[], index: number): NewCardGroupObj => ({
  id: cardGroupObj[0].id,//`cardGroup${cardGroupObj[0].name}`,
  index: index,
  width: cardGroupObj.length === 1 ? 1 : cardGroupObj.length - 1,
  size: cardGroupObj.length,
  cards: cardGroupObj,
});

const isBff = (card?: GameCard) => card && card.cardType === "bff";

const isZwilling = (card?: GameCard) => card && card.cardType === "enchant";

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


 export type NewCardGroupObj = {
    id: number;
    index: number;
    width: number;
    size: number;
    cards: CardGroup;
  };

// const convertArraysToObjs = (cardGroups: GameCard[][]): NewCardGroupObj[] => cardGroups.map(c => createCardGroupObj(c))

// export const getCardGroupObjsAlt = (GCZCards: GameCard[]): NewCardGroupObj[] => pipe(getCardGroups, filterOutDuplicates, convertArraysToObjs)(GCZCards)

const getGCZWidthMapFromObjs = (GCZCardObjs: NewCardGroupObj[]) => GCZCardObjs.map(cardGroup => cardGroup.width);

export const getCumulativeWidths = (GCZCardObjs: NewCardGroupObj[]) : number[]=> {
  
  const map = getGCZWidthMapFromObjs(GCZCardObjs).reduce((acc, curr) => [...acc , curr + acc[acc.length -1]], [0])
  return map//map.slice(0, map.length - 1)
};
