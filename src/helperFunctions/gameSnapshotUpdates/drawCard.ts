import { produce } from "immer";
import { compareProps } from "../tests";

export function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}


export const drawCardUpdateSnapshot = ( destinationPlayer: number, gameSnapshot: GameSnapshot): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const destinationPlaceId = gameSnapshot.players[destinationPlayer].places.hand.id;

    if (destinationPlayer !== null) {
      const newPlayerId = gameSnapshot.players[destinationPlayer].places["hand"].playerId;
      setAttributes(draft.nonPlayerPlaces["deck"].cards[0], { placeId: destinationPlaceId, playerId: newPlayerId, index: 0 });
      const [deckCard] = draft.nonPlayerPlaces["deck"].cards.splice(0, 1);
      draft.players[destinationPlayer].places["hand"].cards.splice(0, 0, deckCard);
      draft.players[destinationPlayer].places["hand"].cards = draft.players[destinationPlayer].places["hand"].cards.map((card, i) => ({
        ...card,
        index: i,
      }));
      compareProps(draft.players[destinationPlayer].places["hand"].cards);
    }
  });
