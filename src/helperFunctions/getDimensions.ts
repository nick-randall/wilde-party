export const getDimensions = (place: string, player: number, numCards: number = 0) => {

  const tableCardHeights = { enemy: 120, self: 148 };
  const handCardHeights = { enemy: 100, self: 180 };

  const playerType = player === 0 || player === null ? "self" : "enemy";

  const heightToWidthRatio = 1500 / 973;
  const tableCardHeight = tableCardHeights[playerType];
  const tableCardWidth = tableCardHeight / heightToWidthRatio;

  const handCardHeight = handCardHeights[playerType];
  const handCardWidth = handCardHeight / heightToWidthRatio;

  const handToTableScaleFactor = tableCardHeight / handCardHeight;

  const dimensions: AllDimensions = {
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
    rotation: place === "deck" ? () => 0 : (index: number) => 10 * index - (numCards / 2 - 0.5) * 10,
    scale: 2.4,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    handToTableScaleFactor: handToTableScaleFactor,
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
    rotation: (index: number) => 10 * index - (numCards / 2 - 0.5) * 10,
    scale: 2,
    handToTableScaleFactor: handToTableScaleFactor,
  };
  if (place === "hand") return handDimensions;
  return dimensions;
};