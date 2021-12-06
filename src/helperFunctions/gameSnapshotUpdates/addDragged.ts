import { locate } from "../locateFunctions";
import { produce } from "immer";
import {
  getCardGroupObjs,
  getCardGroupObjsFromSnapshot,
  getCardRowAndShape,
  getCardRowShapeOnDraggedOver,
  getCardRowShapeOnRearrange,
} from "../groupGCZCards";

function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const addDragged = (gameSnapshot: GameSnapshot, sourceIndex: number, destinationPlaceId: string, destinationIndex: number): GameSnapshot =>
  produce(gameSnapshot, draft => {
    const { player, place } = locate(destinationPlaceId, gameSnapshot);
// if place is null check specialsZone
    if (place === "specialsZone"){

    }

    if (player !== null) {
      let targetIndex = destinationIndex;
      if (place === "GCZ") {
        const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"];
        const GCZ = gameSnapshot.players[player].places["GCZ"];

        const cardGroupObjs = getCardGroupObjs( enchantmentsRow.cards, GCZ.cards);
        const cardRowShape = getCardRowShapeOnDraggedOver(cardGroupObjs)
        targetIndex = cardRowShape[destinationIndex];
      }
      
      const newPlayerId = gameSnapshot.players[player].places[place].playerId;
      setAttributes(draft.players[0].places.hand.cards[sourceIndex], { placeId: destinationPlaceId, playerId: newPlayerId, index: targetIndex });
      const [handCard] = draft.players[0].places.hand.cards.splice(sourceIndex, 1);
      draft.players[player].places[place].cards.splice(targetIndex, 0, handCard);
      draft.players[player].places[place].cards = draft.players[player].places[place].cards.map((c, i) => ({ ...c, index: i }));
    }
  });
