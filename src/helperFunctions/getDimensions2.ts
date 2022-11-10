const heightToWidthRatio = 1500 / 973;
const tableCardHeights = { enemy: 120, self: 148 };
const handCardHeights = { enemy: 100, self: 180 };

export const getTableCardDimensions = (player: number | null, place: PlaceType, cardType: CardType = "guest"): CardDimensions2 => {
  const cardHeight = player === 0 ? 148 : 120; //tableCardHeights[playerType];
  const cardWidth = cardHeight / heightToWidthRatio;

  const rotateY = place === "deck" ? 180 : 0;
  const offsetLeft = cardType === "bff" ? cardWidth / 2 : 0;
  const offsetTop = cardType === "bff" || cardType === "zwilling" ? cardHeight / 2 : 0;

  // TODO set Zindex
  return { cardHeight, cardWidth, rotateY, offsetLeft, offsetTop, rotateX: 0, scale: 1, zIndex: 5 };
};

export const getHandCardDimensions = (player: number | null, numCards: number = 0, index: number): CardDimensions2 => {
  const cardHeight = player === 0 ? 180 : 100;
  const cardWidth = cardHeight / heightToWidthRatio;

  const rotateX = 10 * index - (numCards / 2 - 0.5) * 10;
  const rotateY = player === 0 ? 0 : 180;

  return { cardHeight, cardWidth, rotateX, rotateY, scale: 1, zIndex: 5 };
};

export const getPlaceDimensions = (player: number, place: PlaceType, numCards = 0): PlaceDimensions => {
  const playerType = player === 0 || player === null ? "self" : "enemy";
  const tableCardHeight = tableCardHeights[playerType];
  const tableCardWidth = tableCardHeight / heightToWidthRatio;
  const places: { [key in PlaceType]: any } = {
    hand: {
      cardLeftSpread: 35,
      maxCardLeftSpread: 125,
      cardTopSpread: 0,
      handCardHeight: handCardHeights[playerType],
      handCardWidth: handCardHeights[playerType] / heightToWidthRatio,
    },
    GCZ: { cardLeftSpread: numCards < 6 ? tableCardWidth : tableCardWidth - numCards * 3 },
    UWZ: { cardTopSpread: -40 },
    specialsZone: { cardTopSpread: -30 },
    deck: {},
    discardPile: {},
    enchantmentsRow: {},
  };

  const { maxCardLeftSpread, cardLeftSpread, cardTopSpread, handCardHeight, handCardWidth } = places[place];

  return {
    cardLeftSpread: cardLeftSpread || 0,
    cardTopSpread: cardTopSpread || 0,
    maxCardLeftSpread: maxCardLeftSpread || 0,
    cardHeight: handCardHeight || tableCardHeight,
    cardWidth: handCardWidth || tableCardWidth,
  };
};

const extractCardDimensions = (placeDimensions: PlaceDimensions, numCards: number = 0, index: number) => {
  const {cardLeftSpread, cardTopSpread, maxCardLeftSpread, ...cardDimensions} = placeDimensions;
  const cardAnimationDimensions: CardAnimationDimensions =  {rotateX: 0, rotateY: 0, scale: 0,  ...cardDimensions}

}
