import { maxNumGuestCards } from "../../gameSettings/gameSettings";
import { isOnlyCardInPlace, leftNeighbourIsEnchantable, rightNeighbourIsEnchantable } from "../canEnchantNeighbour";
import { locate } from "../locateFunctions";
import { highlightPlacePlayerIsOfCorrectType } from "./highlightFunctions";
//import { ownerHighlightCardUnenchanted, highlightCardUnenchanted, leftNeighbourOfHighlightCardIsNotBFFEnchanted } from "./cardHighlightFunctions";
import { HighlightCardFunction, HighlightPlayerFunction } from "./highlightFunctionTypes";

export const ownerHighlightCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean => {
  console.log("warning: logic for this test not implemented");
  return true;
};

const allTrueWithArgs =
  (...funcs: ((highlight: any, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean)[]) =>
  (highlight: GamePlace | GameCard | GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
    !funcs.map(func => func(highlight, draggedCard, gameSnapshot)).includes(false);

// checks whether a BFF can target a particular card:
// requirement = that card has an enchantable neighbour
export const highlightCardHasEnchantableNeighbour = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  const { player } = locate(highlightCard.id, gameSnapshot);
  if (player !== null) {
    const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"].cards;
    const GCZ = gameSnapshot.players[player].places["GCZ"].cards;
    if (isOnlyCardInPlace(GCZ)) return false;
    if (rightNeighbourIsEnchantable(highlightCard.index, enchantmentsRow, GCZ)) return true;
    else return leftNeighbourIsEnchantable(highlightCard.index, enchantmentsRow);
  }
  return false;
};

export const highlightCardUnenchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  const { player } = locate(highlightCard.id, gameSnapshot);
  if (player !== null) {
    const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"].cards;
    const enchantmentsRowIndexes = enchantmentsRow.map(e => e.index);
    return !enchantmentsRowIndexes.includes(highlightCard.index);
  }
  return false;
};

export const leftNeighbourOfHighlightCardIsNotBFFEnchanted = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  const { player } = locate(highlightCard.id, gameSnapshot);
  if (player !== null) {
    const enchantmentsRow = gameSnapshot.players[player].places["enchantmentsRow"].cards;
    const leftNeighbourEnchantCard = enchantmentsRow.find(card => card.index === highlightCard.index - 1);
    console.log(leftNeighbourEnchantCard?.image)
    return leftNeighbourEnchantCard?.cardType !== "bff";
  }
  return false;
};


//canEnchantWithBFF
export const canEnchantWithBFF = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, highlightCardHasEnchantableNeighbour, leftNeighbourOfHighlightCardIsNotBFFEnchanted);

//canEnchantWithZwilling Or With e.g. perplex
export const canEnchant = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, leftNeighbourOfHighlightCardIsNotBFFEnchanted);

// steal

const getNumGuestCards = (GCZ: GamePlace) => GCZ.cards.map(e => (e.numGuestPlaces ? e.numGuestPlaces : 0)).reduce((acc, curr) => acc + curr);

const pl0GCZenoughSpace = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  getNumGuestCards(gameSnapshot.players[0].places.GCZ) < maxNumGuestCards;

// "accepted type" is an attribute of a place NOT a check that a targeted card is of correct type
export const highlightCardIsOfAcceptedType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
  highlightCard.cardType === draggedCard.action.cardHighlightType;

export const highlightCardIsNotMine = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  console.log("warning: logic for this test not implemented");
  return true;
}; //locate(highlightCard.playerId).player !== 0;

//canSteal
export const canSteal = allTrueWithArgs(pl0GCZenoughSpace, highlightCardIsOfAcceptedType, highlightCardIsNotMine);

// canSwap =
export const canSwap = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  console.log("canSwap logic not created, ");
  return true;
};

// canDestroy

const highlightCardCorrectType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => highlightCard.cardType === draggedCard.action.cardHighlightType
 //true; //{
// eg "Polizei" only targets unwanteds, "Partyflüsterer" only guests
//const correctTypes = draggedCard.legalTargets[0].cardTypes
//};
const highlightCardPlayerIsOfCorrectType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot): boolean =>{
  console.log(locate(highlightCard.id, gameSnapshot).place, highlightCard.id, (draggedCard.action.targetPlayerType === "enemy" &&
    locate(highlightCard.id, gameSnapshot).player !== locate(draggedCard.id, gameSnapshot).player) ||
  (draggedCard.action.targetPlayerType === "self" && locate(highlightCard.id, gameSnapshot).player === locate(draggedCard.id, gameSnapshot).player), "highlightCardPlayerIsOfCorrectType")
  return  (draggedCard.action.targetPlayerType === "enemy" &&
    locate(highlightCard.id, gameSnapshot).player !== locate(draggedCard.id, gameSnapshot).player) ||
  (draggedCard.action.targetPlayerType === "self" && locate(highlightCard.id, gameSnapshot).player === locate(draggedCard.id, gameSnapshot).player);
}

export const canDestroy = allTrueWithArgs(canEnchant, highlightCardPlayerIsOfCorrectType, highlightCardCorrectType, highlightCardUnenchanted);

export const canProtectSelf: HighlightPlayerFunction = (highlightPlayer: GamePlayer, draggedCard: GameCard, gameSnaphot: GameSnapshot) => {
  console.log("error: this function 'canProtectSelf' has not been created yet");
  return true;
};

export const getCardFunctions = (actionType: ActionType): HighlightCardFunction => {
  if (actionType === "destroy") return canDestroy;
  else if (actionType === "enchant") return canEnchant;
  else if (actionType === "enchantWithBff") return canEnchantWithBFF;
  //else if (actionType === "swap")
  return canSwap;
};