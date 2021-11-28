import produce from "immer";
import { locate } from "../locateFunctions";
import { compareProps } from "../tests";

function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const enchant = (gameSnapshot: GameSnapshot, sourceIndex: number, destinationPlaceId: string, targetId: string): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player, place } = locate(destinationPlaceId, gameSnapshot);
    if (player !== null) {
      
      const enchantmentsRowId = gameSnapshot.players[player].places["enchantmentsRow"].id;
      const newPlayerId = gameSnapshot.players[player].places["enchantmentsRow"].playerId;
      const targetCardId = place === "GCZ" ? targetId.replace("cardGroup", "") : targetId
      // hmmm... a little bit dodgy to extract card of cardGroup this way
      // --- ie by using image
      // would be better to get card Id somehow...
      const destinationIndex = gameSnapshot.players[player].places[place].cards.map(e => e.image).indexOf(targetCardId)
      
      setAttributes(draft.players[0].places.hand.cards[sourceIndex], { placeId: enchantmentsRowId, playerId: newPlayerId, index: destinationIndex });
      
      const [handCard] = draft.players[0].places.hand.cards.splice(sourceIndex, 1);
      draft.players[player].places["enchantmentsRow"].cards.splice(destinationIndex, 0, handCard);
      compareProps(draft.players[player].places["enchantmentsRow"].cards)
    }
  });
