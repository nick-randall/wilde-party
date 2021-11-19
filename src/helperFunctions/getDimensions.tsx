import store from "../redux/store";
import { getNumCards, locate } from "./locateFunctions";

const scaleFactor = 2.2;
const handToTableFactor = 200 / 160;

export const getAllDimensions = (placeId: string) => {
  const gameSnapshot = store.getState().gameSnapshot;
  const { place } = locate(placeId, gameSnapshot);

  const placeType = place;
  const numCards = getNumCards(placeId, gameSnapshot);

  const dimensions: AllDimensions = {
    featuredCardScale: scaleFactor,
    cardHeight: 160,
    cardWidth: 102,
    cardLeftSpread: (numCards < 7 ? 102 : 75),
    cardTopSpread: place === "specialsZone" ? -30 : 0,
   zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    tableCardzIndex:  3,
    rotation: 0,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    //tableCardzIndex: place === "enchantmentsRow" ? 5 : place === "hand" ? 9 : 3,
     // leftOffset: placeType !== "enchantmentsRow" ? 0 : numCards < 7 ? 32.5 : 17.5,
    // topOffset: placeType !== "enchantmentsRow" ? 0 : 65,
  };

  const handDimensions: AllDimensions = {
    featuredCardScale: scaleFactor * handToTableFactor,
    cardHeight: 200,
    cardWidth: 140,
    cardLeftSpread: (numCards / 2 - 0.5) * 1,
    cardTopSpread: 0,
    zIndex: 5,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    draggedCardzIndex: 7,
    tableCardzIndex: 9,
    rotation: (numCards / 2 - 0.5) * 10,
    // leftOffset: 0,
    // topOffset: 65,
  };
  if (placeType === "hand") return handDimensions;
  return dimensions;
};
