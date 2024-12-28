import { NewCardGroupObj } from "./groupGCZCards";

export const getEnchantableNeighbours = (GCZCardRow: NewCardGroupObj[], index: number): EnchantableNeighbour[] => {
  const enchantableNeighbours: EnchantableNeighbour[] = [];
  if (index < GCZCardRow.length - 1) {
    const rightNeighbour = GCZCardRow[index + 1];
    if (rightNeighbour.cards.length === 1) {
      enchantableNeighbours.push("right");
    }
  }
  if (index > 0) {
    const leftNeighbour = GCZCardRow[index - 1];
    if (leftNeighbour.cards.length === 1) {
      enchantableNeighbours.push("left");
    }
  }

  return enchantableNeighbours;
};
