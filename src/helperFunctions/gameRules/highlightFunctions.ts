import { maxNumGuestCards } from "../../gameSettings/gameSettings";
import { isOnlyCardInPlace, leftNeighbourIsEnchantable, rightNeighbourIsEnchantable } from "../canEnchantNeighbour";
import { locate } from "../locateFunctions";
import { getCardFunctions } from "./cardHighlightFunctions";
import { HighlightCardFunction, HighlightPlaceFunction, HighlightPlayerFunction } from "./highlightFunctionTypes";

const allTrue =
  (...funcs: ((...args: any[]) => boolean)[]) =>
  (...args: any[]) =>
    !funcs.map(func => func(...args)).includes(false);

// const allTrueWithArgs =
//   (...funcs: ((...args: any[]) => boolean)[]) =>
//   (highlight: GamePlace | GameCard | GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
//     !funcs.map(func => func(highlight, draggedCard, gameSnapshot)).includes(false);

const allTrueWithArgs =
  (...funcs: ((highlight: any, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean)[]) =>
  (highlight: GamePlace | GameCard | GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
    !funcs.map(func => func(highlight, draggedCard, gameSnapshot)).includes(false);

// add
export const highlightPlaceHasEnoughSpace = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>{
  console.log(highlightPlace.placeType, highlightPlace.id, highlightPlace.playerId, locate(highlightPlace.id, gameSnapshot).place !== "GCZ" ? true : highlightPlace.cards.length < maxNumGuestCards, 
  "highlightPlaceHasEnoughSpace")

  return locate(highlightPlace.id, gameSnapshot).place !== "GCZ" ? true : highlightPlace.cards.length < maxNumGuestCards;}

export const draggedIsOfAcceptedType = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>{
  console.log(highlightPlace.placeType, draggedCard.name, draggedCard.cardType, highlightPlace.id, highlightPlace.playerId, draggedCard.cardType === highlightPlace.acceptedCardType, "draggedIsOfAcceptedType");
  return  draggedCard.cardType === highlightPlace.acceptedCardType;}

export const highlightPlacePlayerIsOfCorrectType = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>{
  console.log(highlightPlace.placeType, highlightPlace.id, highlightPlace.playerId, (draggedCard.action.targetPlayerType === "enemy" &&
    locate(highlightPlace.id, gameSnapshot).player !== locate(draggedCard.id, gameSnapshot).player) ||
  (draggedCard.action.targetPlayerType === "self" && locate(highlightPlace.id, gameSnapshot).player === locate(draggedCard.id, gameSnapshot).player), "highlightPlacePlayerIsOfCorrectType")
  return  (draggedCard.action.targetPlayerType === "enemy" &&
    locate(highlightPlace.id, gameSnapshot).player !== locate(draggedCard.id, gameSnapshot).player) ||
  (draggedCard.action.targetPlayerType === "self" && locate(highlightPlace.id, gameSnapshot).player === locate(draggedCard.id, gameSnapshot).player);
}

//canAddDragged
export const canAddDragged = allTrueWithArgs(highlightPlaceHasEnoughSpace, draggedIsOfAcceptedType, highlightPlacePlayerIsOfCorrectType);

// enchant

// //canEnchantWithBFF
// export const canEnchantWithBFF = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, highlightNeighborCardEnchantable, leftNeighbourOfHighlightCardIsNotBFFEnchanted);

// //canEnchantWithZwilling Or With e.g. perplex
// export const canEnchant = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, leftNeighbourOfHighlightCardIsNotBFFEnchanted);

export const canProtectSelf: HighlightPlayerFunction = (highlightPlayer: GamePlayer, draggedCard: GameCard, gameSnaphot: GameSnapshot) => {
  console.log("error: this function 'canProtectSelf' has not been created yet");
  return true;
};

// protectSelf
// drawCardsPlayMoreCards
// stromAusfall
// getMoreRolls
// interrupt

export const getPlayerFunctions = (actionType: ActionType): HighlightPlayerFunction => {
  //if (actionType === "protectSelf")
  return canProtectSelf;
};

export const getPlaceFunctions = (actionType: ActionType): HighlightPlaceFunction => {
  //if(actionType === "addDragged")
  return canAddDragged;
};

export const highlightFunctions = {
  card: getCardFunctions,
  place: getPlaceFunctions,
  player: getPlayerFunctions,
};

// export const getHighlightFunctions = (highlightType: HighlightType) => {
//   if(highlightType === "card") return highlightCardFunctions;
//   place: highlightPlaceFunctions,
//   player: highlightPlayerFunctions,
// };
