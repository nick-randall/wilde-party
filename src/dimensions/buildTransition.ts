import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import { getLayout } from "./getLayout";

const getCardOffsetWithinPlace = (index: number, placeId: string, gameSnapshot: GameSnapshot): { x: number; y: number } => {
  const { player, place } = locate(placeId, gameSnapshot);
  const numCards = getNumCards(placeId, gameSnapshot);
  if (player === 0) {
    switch (place) {
      case "hand":
        // y COULD also return the rotated height offset
        return { x: 35 * index - (numCards / 2 - 0.5) * 35, y: 0 };
    }
  } else if (player === 1) {
  } else {
    // if player === null
    switch (place) {
      case "deck":
        return { x: 0, y: 0 };
    }
  }
  return { x: 0, y: 0 };
};

export const buildTransition = (
  originPlaceId: string,
  originIndex: number,
  destinationPlaceId: string,
  destinationIndex: number,
  screenSize: { width: number; height: number },
  gameSnapshot: GameSnapshot
) => {
  const { x: originPlaceX, y: originPlaceY } = getLayout(originPlaceId, screenSize);
  const { x: originCardOffsetX, y: originCardOffsetY } = getCardOffsetWithinPlace(originIndex, originPlaceId, gameSnapshot);
  const origin = { x: originPlaceX + originCardOffsetX, y: originPlaceY + originCardOffsetY };

  const { x: destinationPlaceX, y: destinationPlaceY } = getLayout(destinationPlaceId, screenSize);
  const { x: destinationCardOffsetX, y: destinationCardOffsetY } = getCardOffsetWithinPlace(destinationIndex, destinationPlaceId, gameSnapshot);
  const destination = { x: destinationPlaceX + destinationCardOffsetX, y: destinationPlaceY + destinationCardOffsetY };

  const delta = { x: origin.x - destination.x, y: origin.y - destination.y };
  return delta;
};
