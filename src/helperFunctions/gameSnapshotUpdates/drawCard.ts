import { produce } from "immer";
import { getSettings } from "../../gameSettings/uiSettings";
import { compareProps } from "../tests";

export function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const drawCardUpdateSnapshot = (handId: string, player: number, gameSnapshot: GameSnapshot): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const newPlayerId = gameSnapshot.players[player].places["hand"].playerId;
    setAttributes(draft.nonPlayerPlaces["deck"].cards[0], { placeId: handId, playerId: newPlayerId, index: 0 });
    const [deckCard] = draft.nonPlayerPlaces["deck"].cards.splice(0, 1);
    draft.players[player].places["hand"].cards.splice(0, 0, deckCard);
    draft.players[player].places["hand"].cards = draft.players[player].places["hand"].cards.map((card, i) => ({
      ...card,
      index: i,
    }));
    const settings = getSettings();
    if(settings.logVerbose)
    compareProps(draft.players[player].places["hand"].cards);
  });
