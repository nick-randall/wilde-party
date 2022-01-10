import { measureDistance, widthOfRotated } from "../helperFunctions/equations";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import locatePlayer from "../helperFunctions/locateFunctions/locatePlayer";
import { RootState } from "../redux/store";
import { getLayout } from "./getLayout";
import { getPlacesLayout } from "./getPlacesLayout";
import getPlayersLayout from "./getPlayersLayout";

const getCardOffsetWithinPlace = (index: number, placeId: string, gameSnapshot: GameSnapshot): { x: number; y: number } => {
  const { player, place } = locate(placeId, gameSnapshot);
  const { cardLeftSpread, cardWidth } = getAllDimensions(placeId, gameSnapshot);
  const numCards = getNumCards(placeId, gameSnapshot);
  switch (place) {
    case "hand":
            // not quite right for enemy cards...

      return { x: cardWidth - cardLeftSpread * numCards, y: 0 };  }
  return { x: 0, y: 0 };
};

const durationConstant = (distance: number) => (distance < 0 ? -5 : 5);

const getOriginDelta = (
  originPlaceId: string,
  originIndex: number,
  destinationPlaceId: string,
  destinationIndex: number,
  screenSize: { width: number; height: number },
  state: RootState
) => {
  const { x: originPlayerX, y: originPlayerY, width: destPlayerWidth, height: destPlayerHeight } = getPlayersLayout(screenSize, originPlaceId, state);

  const { x: originPlaceX, y: originPlaceY } = getPlacesLayout(originPlaceId, { width: destPlayerWidth, height: destPlayerHeight }, state);
  const { x: originCardOffsetX, y: originCardOffsetY } = getCardOffsetWithinPlace(originIndex, originPlaceId, state.gameSnapshot);
  const origin = { x: originPlayerX + originPlaceX + originCardOffsetX, y: originPlayerY + originPlaceY + originCardOffsetY };

  const {
    x: destinationPlayerX,
    y: destinationPlayerY,
    width: originPlayerWidth,
    height: originPlayerHeight,
  } = getPlayersLayout(screenSize, destinationPlaceId, state);
  const { x: destinationPlaceX, y: destinationPlaceY } = getPlacesLayout(
    destinationPlaceId,
    { width: originPlayerWidth, height: originPlayerHeight },
    state
  );

  const { x: destinationCardOffsetX, y: destinationCardOffsetY } = getCardOffsetWithinPlace(destinationIndex, destinationPlaceId, state.gameSnapshot);
  const destination = {
    x: destinationPlayerX + destinationPlaceX + destinationCardOffsetX,
    y: destinationPlayerY + destinationPlaceY + destinationCardOffsetY,
  };
  const originDelta = { x: origin.x - destination.x, y: origin.y - destination.y };
  console.log(origin.x, destination.x, origin.y, destination.y);
  const distance = 50; // measureDistance(origin.x, origin.y, destination.x, destination.y);
  //return { originDelta: {x: originPlaceX - destinationPlaceX, y: originPlaceY - destinationPlaceY}, distance: distance }
  return { originDelta: originDelta, distance: distance };
};

const getTransitionData = (transitionType: string, distance: number) => {
  let curve = "";
  let startAnimation = "";
  let startAnimationDuration = 0;
  let cardInitialrotation = 0;
  let transitionDuration = 0;
  switch (transitionType) {
    case "drawCard":
      startAnimation = "flip-grow";
      cardInitialrotation = 0;
      startAnimationDuration = 2;
      transitionDuration = 1;
      curve = "ease-out";
  }
  const calculatedAnimationDuration = startAnimationDuration * distance * durationConstant(distance);
  const calculatedTransitionDuration = transitionDuration * distance * durationConstant(distance);

  return {
    transitionDuration: calculatedTransitionDuration,
    curve: curve,
    startAnimation: startAnimation,
    startAnimationDuration: calculatedAnimationDuration,
    cardInitialrotation: cardInitialrotation,
  };
};

export interface TransitionInputs {
  cardId: string;
  transitionType: string;
  originPlaceId: string;
  originIndex: number;
  destinationPlaceId: string;
  destinationIndex: number;
  state: RootState;
}

export const buildTransition: (
  cardId: string,
  transitionType: string,
  delay: number,
  originPlaceId: string,
  originIndex: number,
  destinationPlaceId: string,
  destinationIndex: number,
  state: RootState
) => TransitionData = (
  cardId: string,
  transitionType: string,
  delay: number,
  originPlaceId: string,
  originIndex: number,
  destinationPlaceId: string,
  destinationIndex: number,
  state: RootState
) => {
  const { gameSnapshot, screenSize } = state;
  const originDimensions = getAllDimensions(originPlaceId, gameSnapshot);
  const destinationPlayer = locatePlayer(destinationPlaceId, gameSnapshot);
  const originPlayer = locatePlayer(originPlaceId, gameSnapshot);

  //const destinationPlayerId = gameSnapshot.players[destinationPlayer]

  const { originDelta, distance } = getOriginDelta(originPlaceId, originIndex, destinationPlaceId, destinationIndex, screenSize, state);

  const { transitionDuration, curve, cardInitialrotation, startAnimation, startAnimationDuration } = getTransitionData(transitionType, distance);

  const transition: TransitionData = {
    cardId: cardId,
    originDelta: originDelta,
    originDimensions: originDimensions,
    duration: transitionDuration,
    startAnimation: startAnimation,
    startAnimationDuration: startAnimationDuration,
    cardInitialrotation: cardInitialrotation,
    wait: delay,
    curve: curve,
  };
  console.log(startAnimationDuration);
  //console.log(transition)
  //return originDelta;
  return transition;
};
