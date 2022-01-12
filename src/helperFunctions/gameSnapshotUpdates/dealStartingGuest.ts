import { produce } from "immer";
import { identical } from "ramda";
import { compareProps } from "../tests";

export function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const dealStartingGuestUpdateSnapshot = (player: number, gameSnapshot: GameSnapshot): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const newPlayerId = gameSnapshot.players[player].places["GCZ"].playerId;
    const GCZId = gameSnapshot.players[player].places["GCZ"].id;
    setAttributes(draft.nonPlayerPlaces["deck"].cards[0], { placeId: GCZId, playerId: newPlayerId, index: 0 });
    const [deckCard] = draft.nonPlayerPlaces["deck"].cards.splice(0, 1);
    draft.players[player].places["GCZ"].cards.splice(0, 0, deckCard);
    draft.players[player].places["GCZ"].cards = draft.players[player].places["GCZ"].cards.map((card, i) => ({
      ...card,
      index: i,
    }));
    compareProps(draft.players[player].places["GCZ"].cards);
  });
