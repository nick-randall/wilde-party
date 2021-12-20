import { widthOfRotated } from "../helperFunctions/equations";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import { getLayout } from "./getLayout";
import { getLayoutWithSnapshot } from "./getLayoutWithSnapshot";

const getCardOffsetWithinPlace = (index: number, placeId: string, gameSnapshot: GameSnapshot): { x: number; y: number } => {
  const { player, place } = locate(placeId, gameSnapshot);
  const { cardLeftSpread, cardWidth } = getAllDimensions(placeId, gameSnapshot);
  const numCards = getNumCards(placeId, gameSnapshot);
  if (player === 0) {
    switch (place) {
      case "hand":
        // y COULD also return the rotated height offset
        // x is also affected by rotation
        // const offsetWithoutRotation = 35 * index - (numCards / 2 - 0.5) * 35;
        // const rotation = 10 * index - (numCards / 2 - 0.5) * 10;
        // const widthAfterRotation = widthOfRotated(rotation, cardWidth, cardHeight);
        //console.log(widthAfterRotation)
        // console.log(cardWidth);
        // const rotationOffset = (widthAfterRotation - cardWidth) / 2;
        // console.log(35 * index - (numCards / 2 - 0.5) * 35, rotationOffset);
        return { x: -(cardLeftSpread / 2 - 0.5) * numCards, y: 0 };
      // return { x: offsetWithoutRotation + rotationOffset, y: 0 };
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
  const { x: originPlaceX, y: originPlaceY } = getLayoutWithSnapshot(originPlaceId, gameSnapshot, screenSize);
  const { x: originCardOffsetX, y: originCardOffsetY } = getCardOffsetWithinPlace(originIndex, originPlaceId, gameSnapshot);
  const origin = { x: originPlaceX + originCardOffsetX, y: originPlaceY + originCardOffsetY };

  const { x: destinationPlaceX, y: destinationPlaceY } = getLayoutWithSnapshot(destinationPlaceId, gameSnapshot, screenSize);
  const { x: destinationCardOffsetX, y: destinationCardOffsetY } = getCardOffsetWithinPlace(destinationIndex, destinationPlaceId, gameSnapshot);
  const destination = { x: destinationPlaceX + destinationCardOffsetX, y: destinationPlaceY + destinationCardOffsetY };
  console.log(destinationCardOffsetX);
  const delta = { x: origin.x - destination.x, y: origin.y - destination.y };
  return delta;
};
