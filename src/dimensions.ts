let place = "GCZ";
let numCards =  7

export const dimensions: CardDimensions = {
  cardHeight: place !== "hand" ? 160 : 200,
  cardWidth: place !== "hand" ? 102 : 125,
  cardLeftSpread: place === "specialsZone" ? 0 : place === "hand" ? (numCards / 2 - 0.5) * 1 : numCards < 7 ? 102 : 75,
  cardTopSpread: place === "specialsZone" ? -36 : 0,
  leftOffset: (numCards < 7 ? 51 : 25),
  topOffset: place !== "enchantmentsRow" ? 0 : 65,
  draggedCardScale: 1.1,
  draggedCardWidth: 112,
  draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
  //tableCardzIndex: place === "enchantmentsRow" ? 5 : place === "hand" ? 9 : 3,
  tableCardzIndex: place === "hand" ? 9: 3,
  rotation: place === "hand" ? (numCards / 2 - 0.5) * 10 : 0,
};