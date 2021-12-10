import { locate } from "../locateFunctions";
import { produce } from "immer";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver } from "../groupGCZCards";
import { compareProps } from "../tests";

export function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const addDragged = (gameSnapshot: GameSnapshot, sourceIndex: number, destinationPlaceId: string, destinationIndex: number): GameSnapshot =>
  produce(gameSnapshot, draft => {
    let { player, place } = locate(destinationPlaceId, gameSnapshot);
    let targetIndex = destinationIndex;
    let targetPlaceId = destinationPlaceId;
    // if place is null check specialsZone
    if (place === null) {
      if (locate(destinationPlaceId.replace("dropZone", ""), gameSnapshot).place === "specialsZone") {
        // targetIndex = Number(destinationPlaceId.charAt(destinationPlaceId.length - 1));
        // const targetDestinationId = destinationPlaceId.slice(0, destinationPlaceId.length - 1);
        targetPlaceId = destinationPlaceId.replace("dropZone", " ");
        place = "specialsZone";
        player = 0;
        targetIndex = gameSnapshot.players[0].places["specialsZone"].cards.length;
      } else if (locate(destinationPlaceId.slice(0, destinationPlaceId.length - 1), gameSnapshot).place === "specialsZone") {
        targetIndex = Number(destinationPlaceId.charAt(destinationPlaceId.length - 1));
        const targetDestinationId = destinationPlaceId.slice(0, destinationPlaceId.length - 1);
        targetPlaceId = targetDestinationId;
        place = "specialsZone";
        player = locate(targetDestinationId, gameSnapshot).player;
      } else return gameSnapshot;
    }

    if (player !== null && place !== null) {
      if (place === "GCZ") {
        const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"];
        const GCZ = gameSnapshot.players[player].places["GCZ"];

        const cardGroupObjs = getCardGroupObjs(enchantmentsRow.cards, GCZ.cards);
        const cardRowShape = getCardRowShapeOnDraggedOver(cardGroupObjs);
        targetIndex = cardRowShape[destinationIndex];
      }

      const newPlayerId = gameSnapshot.players[player].places[place].playerId;
      setAttributes(draft.players[0].places.hand.cards[sourceIndex], { placeId: targetPlaceId, playerId: newPlayerId, index: targetIndex });
      const [handCard] = draft.players[0].places.hand.cards.splice(sourceIndex, 1);
      draft.players[player].places[place].cards.splice(targetIndex, 0, handCard);
      draft.players[player].places[place].cards = draft.players[player].places[place].cards.map((c, i) => ({ ...c, index: i }));
      compareProps(draft.players[player].places[place].cards);
    }
  });
