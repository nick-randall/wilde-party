import produce from "immer";
import { locate } from "../locateFunctions";
import { compareProps } from "../tests";

function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const enchant = (gameSnapshot: GameSnapshot, sourceIndex: number, targetCardId: string): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player, place } = locate(targetCardId, gameSnapshot);
    if (player !== null) {
      const enchantmentsRowId = gameSnapshot.players[player].places["enchantmentsRow"].id;
      const newPlayerId = gameSnapshot.players[player].places["enchantmentsRow"].playerId;
     
      const destinationIndex = gameSnapshot.players[player].places[place].cards.map(e => e.id).indexOf(targetCardId)  
      console.log(destinationIndex)    
      setAttributes(draft.players[0].places.hand.cards[sourceIndex], { placeId: enchantmentsRowId, playerId: newPlayerId, index: destinationIndex });
      const [handCard] = draft.players[0].places.hand.cards.splice(sourceIndex, 1);
      draft.players[player].places["enchantmentsRow"].cards.push(handCard);
      console.log(draft.players[player].places["enchantmentsRow"].cards)

    }
  });
