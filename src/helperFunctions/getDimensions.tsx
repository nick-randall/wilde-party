import store from "../redux/store";
import { getNumCards, locate } from "./locateFunctions";

export const getAllDimensions = (placeId: string, gameSnapshot: GameSnapshot | null = null) => {
  if (gameSnapshot === null) gameSnapshot = store.getState().gameSnapshot;
  const { place, player } = locate(placeId, gameSnapshot);

  const placeType = place;
  const numCards = getNumCards(placeId, gameSnapshot);
  
  const tableCardHeights = { enemy: 120, self : 148 };
  const handCardHeights = { enemy: 100, self : 180 }
  
  const playerType = player === 0 || player === null ? "self" : "enemy";

  const heightToWidthRatio = 1500 / 973;
  const tableCardHeight =  tableCardHeights[playerType];
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
    zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    tableCardzIndex: 3,
     rotation: placeType === "deck" ? ()=>0: (index: number) => 10 * index - (numCards / 2 - 0.5) * 10,
    scale: 2.4,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    //GCZHeight: numEnchantmentsCards === 0 ? tableCardHeight : tableCardHeight * 1.5,
    handToTableScaleFactor: handToTableScaleFactor,

    // leftOffset: placeType !== "enchantmentsRow" ? 0 : numCards < 7 ? 32.5 : 17.5,
    // topOffset: placeType !== "enchantmentsRow" ? 0 : 65,
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
    zIndex: 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    draggedCardzIndex: 7,
    tableCardzIndex: 9,
    rotation: (index: number) => 10 * index - (numCards / 2 - 0.5) * 10,
    scale: 2,
    //GCZHeight: numEnchantmentsCards === 0 ? 168 : 168 * 1.5,
    handToTableScaleFactor: handToTableScaleFactor,

    // leftOffset: 0,
    // topOffset: 65,
  };
  if (placeType === "hand") return handDimensions;
  return dimensions;
};
