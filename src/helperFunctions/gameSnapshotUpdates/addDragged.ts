import { getNumCards, locate } from "../locateFunctions";
import { produce } from "immer";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver } from "../groupGCZCards";
import { compareProps } from "../tests";
import locatePlayer from "../locateFunctions/locatePlayer";

export function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

export const addDraggedUpdateSnapshot = (gameSnapshot: GameSnapshot, sourcePlaceId: string, sourceIndex: number, destinationPlaceId: string, destinationIndex: number): GameSnapshot =>
  produce(gameSnapshot, draft => {
    let { player: destPlayer, place } = locate(destinationPlaceId, gameSnapshot);
    let sourcePlayer = locatePlayer(sourcePlaceId, gameSnapshot)
    let targetIndex = destinationIndex;
    let targetPlaceId = destinationPlaceId;
    // if place is null check specialsZone
    if (place === null) {
      if (locate(destinationPlaceId.replace("dropZone", ""), gameSnapshot).place === "specialsZone") {
        targetPlaceId = destinationPlaceId.replace("dropZone", "");
        place = "specialsZone";
        destPlayer = 0;
        targetIndex = gameSnapshot.players[0].places["specialsZone"].cards.length;
      } else if (locate(destinationPlaceId.slice(0, destinationPlaceId.length - 1), gameSnapshot).place === "specialsZone") {
        targetIndex = Number(destinationPlaceId.charAt(destinationPlaceId.length - 1));
        const targetDestinationId = destinationPlaceId.slice(0, destinationPlaceId.length - 1);
        targetPlaceId = targetDestinationId;
        place = "specialsZone";
        destPlayer = locate(targetDestinationId, gameSnapshot).player;
      } else return gameSnapshot;
    }

    if (sourcePlayer !== null && destPlayer !== null && place !== null) {
      if (place === "GCZ") {
        const enchantmentsRow = gameSnapshot.players[destPlayer].places["enchantmentsRow"];
        const GCZ = gameSnapshot.players[destPlayer].places["GCZ"];

        const cardGroupObjs = getCardGroupObjs(enchantmentsRow.cards, GCZ.cards);
        const cardRowShape = getCardRowShapeOnDraggedOver(cardGroupObjs);
        targetIndex = cardRowShape[destinationIndex];
      }
      else if (place === "UWZ") {
        targetIndex = getNumCards(destinationPlaceId, gameSnapshot)
      }

      const newPlayerId = gameSnapshot.players[destPlayer].places[place].playerId;
      setAttributes(draft.players[sourcePlayer].places.hand.cards[sourceIndex], { placeId: targetPlaceId, playerId: newPlayerId, index: targetIndex });
      const [handCard] = draft.players[sourcePlayer].places.hand.cards.splice(sourceIndex, 1);
      draft.players[destPlayer].places[place].cards.splice(targetIndex, 0, handCard);
      draft.players[destPlayer].places[place].cards = draft.players[destPlayer].places[place].cards.map((c, i) => ({ ...c, index: i }));
      compareProps(draft.players[destPlayer].places[place].cards);
    }
  });
