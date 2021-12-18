import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import store from "../redux/store";


export const getDimensionsFromSnapshot = (placeId: string, gameSnapshot: GameSnapshot) => {
  
  const { place, player } = locate(placeId, gameSnapshot);
  //const enchantmentsRowId = place === "GCZ" && player !== null ? gameSnapshot.players[player].places["enchantmentsRow"].id : "";
  const placeType = place;
  const numCards = getNumCards(placeId, gameSnapshot);
  //const numEnchantmentsCards = getNumCards(enchantmentsRowId, gameSnapshot);
  
  const heightToWidthRatio = 1500 / 973;
  const tableCardHeight = 148;
  const tableCardWidth = tableCardHeight / heightToWidthRatio;

  const handCardHeight = 180;
  const handCardWidth = handCardHeight / heightToWidthRatio
  
const handToTableScaleFactor = tableCardHeight / handCardHeight;

  const dimensions: AllDimensions = {
    featuredCardScale: 2,
    cardHeight: tableCardHeight,
    cardWidth: tableCardWidth,
    tableCardHeight: tableCardHeight,
    tableCardWidth: tableCardWidth,
    cardLeftSpread: numCards < 6 ? tableCardWidth : tableCardWidth - (numCards * 3),
    cardTopSpread: place !== "specialsZone" ? place === "UWZ" ? -40 : 0 : -30,
    zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    tableCardzIndex: 3,
    rotation:  (index: number) => 10 * index - (numCards / 2 - 0.5) * 10,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    //GCZHeight: numEnchantmentsCards === 0 ? tableCardHeight : tableCardHeight * 1.5,
    handToTableScaleFactor: handToTableScaleFactor

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
    rotation:  (index: number) => 10 * index - (numCards / 2 - 0.5) * 10,
    //GCZHeight: numEnchantmentsCards === 0 ? 168 : 168 * 1.5,
    handToTableScaleFactor: handToTableScaleFactor

    // leftOffset: 0,
    // topOffset: 65,
  };
  if (placeType === "hand") return handDimensions;
  return dimensions;
};
