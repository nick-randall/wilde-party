import produce from "immer";
import { convertSnapshot } from "../../initialCards";
import { locate } from "../locateFunctions";

function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

const hasRightNeighbour = (index: number, array: GameCard[]) => index < array.length - 1;

// const isOnlyCardInPlace = (array: GameCard[]) => array.length < 2;

const rightNeighbourIsEnchanted = (cardIndex: number, enchantmentsRow: GameCard[]) => enchantmentsRow.map(e => e.index).includes(cardIndex + 1);

// const leftNeighbourIsEnchanted = (cardIndex: number, enchantmentsRow: GameCard[]) => enchantmentsRow.map(e => e.index).includes(cardIndex - 1);
// const hasLeftNeighbour = (index: number) => index > 0;

const rightNeighbourIsEnchantable = (index: number, enchantmentsRow: GameCard[], GCZ: GameCard[]) =>
  hasRightNeighbour(index, GCZ) && !rightNeighbourIsEnchanted(index, enchantmentsRow);

// const leftNeighbourIsEnchantable = (index: number, array: GameCard[]) => hasLeftNeighbour(index) && !leftNeighbourIsEnchanted(index, array);

export const enchant = (gameSnapshot: GameSnapshot, handCardIndex: number, targetCardId: string): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player } = locate(targetCardId, gameSnapshot);
    if (player !== null) {
      const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"];
      const GCZ = gameSnapshot.players[player].places["GCZ"];
      const enchantmentsRowId = enchantmentsRow.id;
      const newPlayerId = enchantmentsRow.playerId;
      const playedCardType = gameSnapshot.players[player].places.hand.cards[handCardIndex].cardType;

      let destinationIndex = GCZ.cards.map(e => e.id).indexOf(targetCardId);
      console.log(GCZ.cards[destinationIndex].name  + " is enchant target");
      if (playedCardType === "bff" && !rightNeighbourIsEnchantable(destinationIndex, enchantmentsRow.cards, GCZ.cards)) destinationIndex -= 1;
      setAttributes(draft.players[player].places.hand.cards[handCardIndex], {
        placeId: enchantmentsRowId,
        playerId: newPlayerId,
        index: destinationIndex,
      });
      const [handCard] = draft.players[player].places.hand.cards.splice(handCardIndex, 1);
      draft.players[player].places["enchantmentsRow"].cards.push(handCard);
      console.log("enchanted a card at index " + destinationIndex + "enchantmentsRow is "  ,draft.players[player].places["enchantmentsRow"].cards);
      convertSnapshot(draft);
    }
  });
