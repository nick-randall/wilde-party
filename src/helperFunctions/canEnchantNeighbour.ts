import { locate } from "./locateFunctions";

const hasRightNeighbour = (index: number, array: GameCard[]) => index < array.length - 1;

const hasLeftNeighbour = (index: number) => index > 0;

export const isOnlyCardInPlace = (array: GameCard[]) => array.length < 2;

const rightNeighbourIsEnchanted = (cardIndex: number, enchantmentsRow: GameCard[]) => enchantmentsRow.map(e => e.index).includes(cardIndex + 1);

const leftNeighbourIsEnchanted = (cardIndex: number, enchantmentsRow: GameCard[]) => enchantmentsRow.map(e => e.index).includes(cardIndex - 1);


export const rightNeighbourIsEnchantable = (index: number, enchantmentsRow: GameCard[], GCZ: GameCard[]) =>
  hasRightNeighbour(index, GCZ) && !rightNeighbourIsEnchanted(index, enchantmentsRow);

export const leftNeighbourIsEnchantable = (index: number, array: GameCard[]) => hasLeftNeighbour(index) && !leftNeighbourIsEnchanted(index, array);

export const getLeftOrRightNeighbour = (gameSnapshot: GameSnapshot, targetCardId: string) => {
  const { player } = locate(targetCardId, gameSnapshot);
  if (player !== null) {
    const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"];
    const GCZ = gameSnapshot.players[player].places["GCZ"];
    const index = GCZ.cards.map(e => e.id).indexOf(targetCardId)
    if (rightNeighbourIsEnchantable(index, enchantmentsRow.cards, GCZ.cards)) return "right";
    if (leftNeighbourIsEnchantable(index, enchantmentsRow.cards)) return "left";
  }
  return undefined;
};
