import produce from "immer";
import { convertSnapshot } from "../../initialCards";
import { locate } from "../locateFunctions";

function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const destroyCardUpdateSnapshot = (targetCardId: string, gameSnapshot: GameSnapshot): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player } = locate(targetCardId, gameSnapshot);
    if (player !== null) {
      const enemyGCZ = gameSnapshot.players[player].places["GCZ"];
      const discardPile = gameSnapshot.nonPlayerPlaces["discardPile"];
      const targetIndex = enemyGCZ.cards.map(e => e.id).indexOf(targetCardId);

      setAttributes(draft.players[player].places["GCZ"].cards[targetIndex], {
        placeId: discardPile.id,
        playerId: null,
        index: 0,
      });
      const [targetGuestCard] = draft.players[player].places["GCZ"].cards.splice(targetIndex, 1);
      draft.nonPlayerPlaces["discardPile"].cards.unshift(targetGuestCard);
      convertSnapshot(draft);
    }
  });
