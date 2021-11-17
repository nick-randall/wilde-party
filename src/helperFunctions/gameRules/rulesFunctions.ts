import { maxNumGuestCards } from "../../gameSettings/gameSettings";

const allTrue =
  (...funcs: ((...args: any[]) => boolean)[]) =>
  (...args: any[]) =>
    !funcs.map(func => func(...args)).includes(false);

const allTrueWithArgs =
  (...funcs: ((...args: any[]) => boolean)[]) =>
  (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
    !funcs.map(func => func(highlightPlace, draggedCard, gameSnapshot)).includes(false);


// add
export const highlightPlaceHasEnoughSpace = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>
  
  true//!highlightPlace.maxNumCards ? true : highlightPlace.maxNumCards > getNumCards(highlightPlace.id, gameSnapshot);

export const draggedIsOfAcceptedType = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>
  draggedCard.cardType === highlightPlace.acceptedCardType;

//canAdd
export const canAdd = allTrueWithArgs(highlightPlaceHasEnoughSpace, draggedIsOfAcceptedType);

// enchant
export const ownerHighlightCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean => true;

export const highlightCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true;

export const highlightNeighborCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true;

//canEnchantWithBFF
export const canEnchantWithBFF = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, highlightNeighborCardUnenchanted);

//canEnchantWithZwilling
export const canEnchantZwilling = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted);

// steal

const getNumGuestCards = (GCZ: GamePlace) => GCZ.cards.map(e => e.numGuestPlaces ? e.numGuestPlaces : 0).reduce((acc, curr) =>  acc + curr)

const pl0GCZenoughSpace = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  getNumGuestCards(gameSnapshot.players[0].places.GCZ) < maxNumGuestCards

// "accepted type" is an attribute of a place NOT a check that a targeted card is of correct type
export const highlightCardIsOfAcceptedType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => highlightCard.cardType === draggedCard.action.cardHighlightType;

export const highlightCardIsNotMine = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true//locate(highlightCard.playerId).player !== 0;

//canSteal
export const canSteal = allTrueWithArgs(pl0GCZenoughSpace, highlightCardIsOfAcceptedType, highlightCardIsNotMine);

// destroy
export const destroy = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {};

// canDestroy

export const highlightCardCorrectType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true//{
  // eg "Polizei" only targets unwanteds, "Partyflüsterer" only guests
  //const correctTypes = draggedCard.legalTargets[0].cardTypes
//};

export const canDestroy = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardIsNotMine, highlightCardCorrectType, highlightCardUnenchanted);

// protectSelf
// drawCardsPlayMoreCards
// stromAusfall
// getMoreRolls
// interrupt
