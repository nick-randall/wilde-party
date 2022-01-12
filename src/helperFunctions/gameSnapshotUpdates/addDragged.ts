import { getNumCards, locate } from "../locateFunctions";
import { produce } from "immer";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver } from "../groupGCZCards";
import { compareProps } from "../tests";
import locatePlayer from "../locateFunctions/locatePlayer";
import { getNextIndexOfSpecialsType, getSpecialsOfType, sortSpecials } from "../getSpecialsOfType";

export function setAttributes(card: GameCard, attrs: { [key: string]: any }) {
  for (var key in attrs) {
    card[key] = attrs[key];
  }
}

const uuidIsToLong = (uuid: string) => uuid.length > 36;

export const addDraggedUpdateSnapshot = (
  gameSnapshot: GameSnapshot,
  sourcePlaceId: string,
  sourceIndex: number,
  destinationPlaceId: string,
  destinationIndex: number
): GameSnapshot =>
  produce(gameSnapshot, draft => {
    console.log(destinationIndex)
   const { place: destPlace, player: destPlayer} = (uuidIsToLong(destinationPlaceId))  ? locate(destinationPlaceId.slice(1), gameSnapshot): locate(destinationPlaceId, gameSnapshot)

    let {player: sourcePlayer, place: sourcePlace} = locate(sourcePlaceId, gameSnapshot);
    let targetIndex = destinationIndex;
    if (sourcePlayer !== null && destPlayer !== null && destPlace !== null) {
      if (destPlace === "GCZ") {
        const enchantmentsRow = gameSnapshot.players[destPlayer].places["enchantmentsRow"];
        const GCZ = gameSnapshot.players[destPlayer].places["GCZ"];

        const cardGroupObjs = getCardGroupObjs(enchantmentsRow.cards, GCZ.cards);
        const cardRowShape = getCardRowShapeOnDraggedOver(cardGroupObjs);
        targetIndex = cardRowShape[destinationIndex];
      } else if (destPlace === "specialsZone") {
        console.log("specialsZone addDragged");
        const allSpecials = gameSnapshot.players[destPlayer].places["specialsZone"].cards;
        const specialsType = gameSnapshot.players[sourcePlayer].places["hand"].cards[sourceIndex].specialsCardType;
        if (specialsType) {
          targetIndex = getNextIndexOfSpecialsType(allSpecials, specialsType);
          destinationPlaceId = destinationPlaceId.slice(1);
        }
      } else if (destPlace === "UWZ") {
        targetIndex = getNumCards(destinationPlaceId, gameSnapshot);
      }

      const newPlayerId = gameSnapshot.players[destPlayer].places[destPlace].playerId;
      setAttributes(draft.players[sourcePlayer].places.hand.cards[sourceIndex], {
        placeId: destinationIndex,
        playerId: newPlayerId,
        index: targetIndex,
      });
      const [handCard] = draft.players[sourcePlayer].places.hand.cards.splice(sourceIndex, 1);
      draft.players[destPlayer].places[destPlace].cards.splice(targetIndex, 0, handCard);
      draft.players[destPlayer].places[destPlace].cards = draft.players[destPlayer].places[destPlace].cards.map((c, i) => ({ ...c, index: i }));
      compareProps(draft.players[destPlayer].places[destPlace].cards);
    }
  });

// export const addDraggedUpdateSnapshot = (gameSnapshot: GameSnapshot, sourcePlaceId: string, sourceIndex: number, destinationPlaceId: string, destinationIndex: number): GameSnapshot =>
// produce(gameSnapshot, draft => {
//   let { player: destPlayer, destPlace } = locate(destinationPlaceId, gameSnapshot);
//   let sourcePlayer = locatePlayer(sourcePlaceId, gameSnapshot)
//   let targetIndex = destinationIndex;
//   let targetPlaceId = destinationPlaceId;
//   // if destPlace is null check specialsZone
//   if (destPlace === null) {
//     if (locate(destinationPlaceId.replace("dropZone", ""), gameSnapshot).destPlace === "specialsZone") {
//       targetPlaceId = destinationPlaceId.replace("dropZone", "");
//       destPlace = "specialsZone";
//       destPlayer = 0;
//       targetIndex = gameSnapshot.players[0].places["specialsZone"].cards.length;
//     } else if (locate(destinationPlaceId.slice(0, destinationPlaceId.length - 1), gameSnapshot).destPlace === "specialsZone") {
//       targetIndex = Number(destinationPlaceId.charAt(destinationPlaceId.length - 1));
//       const targetDestinationId = destinationPlaceId.slice(0, destinationPlaceId.length - 1);
//       targetPlaceId = targetDestinationId;
//       destPlace = "specialsZone";
//       destPlayer = locate(targetDestinationId, gameSnapshot).player;
//     } else return gameSnapshot;
//   }

//   if (sourcePlayer !== null && destPlayer !== null && destPlace !== null) {
//     if (destPlace === "GCZ") {
//       const enchantmentsRow = gameSnapshot.players[destPlayer].places["enchantmentsRow"];
//       const GCZ = gameSnapshot.players[destPlayer].places["GCZ"];

//       const cardGroupObjs = getCardGroupObjs(enchantmentsRow.cards, GCZ.cards);
//       const cardRowShape = getCardRowShapeOnDraggedOver(cardGroupObjs);
//       targetIndex = cardRowShape[destinationIndex];
//     }
//     else if (destPlace === "UWZ") {
//       targetIndex = getNumCards(destinationPlaceId, gameSnapshot)
//     }

//     const newPlayerId = gameSnapshot.players[destPlayer].places[destPlace].playerId;
//     setAttributes(draft.players[sourcePlayer].places.hand.cards[sourceIndex], { placeId: targetPlaceId, playerId: newPlayerId, index: targetIndex });
//     const [handCard] = draft.players[sourcePlayer].places.hand.cards.splice(sourceIndex, 1);
//     draft.players[destPlayer].places[destPlace].cards.splice(targetIndex, 0, handCard);
//     draft.players[destPlayer].places[destPlace].cards = draft.players[destPlayer].places[destPlace].cards.map((c, i) => ({ ...c, index: i }));
//     compareProps(draft.players[destPlayer].places[destPlace].cards);
//   }
// });
