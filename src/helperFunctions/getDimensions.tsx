import store from "../redux/store";
import { getNumCards, locate } from "./locateFunctions";

const handToTableScaleFactor = 160 / 211;

export const getAllDimensions = (placeId: string) => {
  const gameSnapshot = store.getState().gameSnapshot;
  const { place, player } = locate(placeId, gameSnapshot);
  const enchantmentsRowId = place === "GCZ" && player !== null ? gameSnapshot.players[player].places["enchantmentsRow"].id: "";

  const placeType = place;
  const numCards = getNumCards(placeId, gameSnapshot);
  const numEnchantmentsCards = getNumCards(enchantmentsRowId, gameSnapshot)

  // ratio height to width is 1.6

  const dimensions: AllDimensions = {
    featuredCardScale: 2,
    cardHeight: 168,
    cardWidth: 105,
    cardLeftSpread: numCards < 6 ? 105 : 75,
    cardTopSpread: place === "specialsZone" ? -30 : 0,
    zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    tableCardzIndex: 3,
    rotation: 0,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    GCZHeight: numEnchantmentsCards === 0 ? 168 : 168 * 1.5,
    // leftOffset: placeType !== "enchantmentsRow" ? 0 : numCards < 7 ? 32.5 : 17.5,
    // topOffset: placeType !== "enchantmentsRow" ? 0 : 65,
  };

  const handDimensions: AllDimensions = {
    featuredCardScale: 2 * handToTableScaleFactor,
    cardHeight: 224,
    cardWidth: 140,
    cardLeftSpread: (numCards / 2 - 0.5) * 1,
    cardTopSpread: 0,
    zIndex: 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    draggedCardzIndex: 7,
    tableCardzIndex: 9,
    rotation: (numCards / 2 - 0.5) * 10,
    GCZHeight: numEnchantmentsCards === 0 ? 168 : 168 * 1.5,

    // leftOffset: 0,
    // topOffset: 65,
  };
  if (placeType === "hand") return handDimensions;
  return dimensions;
};
