import { locate } from "../locateFunctions";
import { produce } from "immer";

function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const addDragged = (gameSnapshot: GameSnapshot, sourceIndex: number, destinationPlaceId: string, destinationIndex: number): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player, place } = locate(destinationPlaceId, gameSnapshot);
    if (player !== null) {
      const newPlayerId = gameSnapshot.players[player].places[place].playerId; 
      // TOD
        // this just changes playerid to 0!
      setAttributes(draft.players[0].places.hand.cards[sourceIndex], { placeId: destinationPlaceId, playerId: newPlayerId, index: destinationIndex });
      const [handCard] = draft.players[0].places.hand.cards.splice(sourceIndex, 1);
      draft.players[player].places[place].cards.splice(destinationIndex, 0, handCard);
    }
  });