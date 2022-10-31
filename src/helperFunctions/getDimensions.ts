export const getDimensions = (player: number | null, place: PlaceType, numCards: number = 0, cardType: CardType = "guest") => {
  const tableCardHeights = { enemy: 120, self: 148 };
  const handCardHeights = { enemy: 100, self: 180 };

  const playerType = player === 0 || player === null ? "self" : "enemy";

  const heightToWidthRatio = 1500 / 973;
  const tableCardHeight = tableCardHeights[playerType];
  const tableCardWidth = tableCardHeight / heightToWidthRatio;

  const handCardHeight = handCardHeights[playerType];
  const handCardWidth = handCardHeight / heightToWidthRatio;

  const handToTableScaleFactor = tableCardHeight / handCardHeight;

  const tableDimensions: AllDimensions = {
    featuredCardScale: 2,
    cardHeight: tableCardHeight,
    cardWidth: tableCardWidth,
    tableCardHeight: tableCardHeight,
    tableCardWidth: tableCardWidth,
    cardLeftSpread: numCards < 6 ? tableCardWidth : tableCardWidth - numCards * 3,
    cardTopSpread: place !== "specialsZone" ? (place === "UWZ" ? -40 : 0) : -30,
    zIndex: place !== "enchantmentsRow" ? 3 : 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    tableCardzIndex: 10,
    scale: 2.4,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    handToTableScaleFactor: handToTableScaleFactor,
    facing: place !== "deck" ? "front" : "back",
    offsetLeft: (cardType: CardType) => (place === "GCZ" && cardType === "bff" ? tableCardWidth / 2 : 0),
    offsetTop: (cardType: CardType) => (place === "GCZ" && (cardType === "bff" || cardType === "zwilling") ? tableCardHeight / 2 : 0),
  };

  const handDimensions: AllDimensions = {
    featuredCardScale: 2 * handToTableScaleFactor,
    cardHeight: handCardHeight,
    cardWidth: handCardWidth,
    tableCardHeight: tableCardHeight,
    tableCardWidth: tableCardWidth,
    cardLeftSpread: 35,
    maxCardLeftSpread: 125,
    cardTopSpread: 0,
    zIndex: 10,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    draggedCardzIndex: 7,
    tableCardzIndex: 10,
    scale: 2,
    handToTableScaleFactor: handToTableScaleFactor,
    facing: player === 0 ? "front" : "back",
    offsetLeft: () => 0,
    offsetTop: () => 0,
  };
  return place === "hand" ? handDimensions : tableDimensions;
};

export const createAnimationDimensions = (dimensions: AllDimensions, rotationX: number, rotationZ: number): CardAnimationDimensions => ({
  rotationX,
  rotationZ,
  ...dimensions,
});

export const rotateHandCard = (index: number, numCards: number) => 10 * index - (numCards / 2 - 0.5) * 10;
