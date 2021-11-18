import { maxNumGuestCards } from "../../gameSettings/gameSettings";
import { HighlightCardFunctionsObj, HighlightFunctionsObj, HighlightPlaceFunctionsObj, HighlightPlayerFunction, HighlightPlayerFunctionsObj } from "./highlightFunctionTypes";

const allTrue =
  (...funcs: ((...args: any[]) => boolean)[]) =>
  (...args: any[]) =>
    !funcs.map(func => func(...args)).includes(false);

const allTrueWithArgs =
  (...funcs: ((...args: any[]) => boolean)[]) =>
  (highlight: GamePlace | GameCard | GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
    !funcs.map(func => func(highlight, draggedCard, gameSnapshot)).includes(false);

// add
export const highlightPlaceHasEnoughSpace = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean => true; //!highlightPlace.maxNumCards ? true : highlightPlace.maxNumCards > getNumCards(highlightPlace.id, gameSnapshot);

export const draggedIsOfAcceptedType = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>
  draggedCard.cardType === highlightPlace.acceptedCardType;

//canAddDragged
export const canAddDragged = allTrueWithArgs(highlightPlaceHasEnoughSpace, draggedIsOfAcceptedType);

// enchant
export const ownerHighlightCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean => true;

export const highlightCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true;

export const highlightNeighborCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true;

//canEnchantWithBFF
export const canEnchantWithBFF = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, highlightNeighborCardUnenchanted);

//canEnchantWithZwilling Or With e.g. perplex
export const canEnchant = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted);

// steal

const getNumGuestCards = (GCZ: GamePlace) => GCZ.cards.map(e => (e.numGuestPlaces ? e.numGuestPlaces : 0)).reduce((acc, curr) => acc + curr);

const pl0GCZenoughSpace = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  getNumGuestCards(gameSnapshot.players[0].places.GCZ) < maxNumGuestCards;

// "accepted type" is an attribute of a place NOT a check that a targeted card is of correct type
export const highlightCardIsOfAcceptedType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  highlightCard.cardType === draggedCard.action.cardHighlightType;

export const highlightCardIsNotMine = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true; //locate(highlightCard.playerId).player !== 0;

//canSteal
export const canSteal = allTrueWithArgs(pl0GCZenoughSpace, highlightCardIsOfAcceptedType, highlightCardIsNotMine);

// canSwap =
export const canSwap = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  console.log("canSwap logic not created, ");
  return true;
};

// canDestroy

export const highlightCardCorrectType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true; //{
// eg "Polizei" only targets unwanteds, "Partyflüsterer" only guests
//const correctTypes = draggedCard.legalTargets[0].cardTypes
//};

export const canDestroy = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardIsNotMine, highlightCardCorrectType, highlightCardUnenchanted);

export const canProtectSelf: HighlightPlayerFunction = (highlightPlayer: GamePlayer, draggedCard: GameCard, gameSnaphot: GameSnapshot) => {
  console.log("error: this function 'canProtectSelf' has not been created yet");
  return true;
};

// protectSelf
// drawCardsPlayMoreCards
// stromAusfall
// getMoreRolls
// interrupt


const highlightCardFunctions: HighlightCardFunctionsObj = {
  destroy: canDestroy,
  steal: canSteal,
  enchant: canEnchant,
  enchantWithBff: canEnchantWithBFF,
  swap: canSwap,
};

const highlightPlaceFunctions: HighlightPlaceFunctionsObj = {
  addDragged: canAddDragged,
};

const highlightPlayerFunctions: HighlightPlayerFunctionsObj = {
  protectSelf: canProtectSelf,
};

export const highlightFunctions: HighlightFunctionsObj = {
  card: highlightCardFunctions,
  place: highlightPlaceFunctions,
  player: highlightPlayerFunctions,
};

