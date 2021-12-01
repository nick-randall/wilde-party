import { maxNumGuestCards } from "../../gameSettings/gameSettings";
import { locate } from "../locateFunctions";
import { ownerHighlightCardUnenchanted, highlightCardUnenchanted } from "./highlightFunctions";
import { HighlightCardFunction, HighlightPlayerFunction } from "./highlightFunctionTypes";

const allTrueWithArgs =
  (...funcs: ((highlight: any, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean)[]) =>
  (highlight: GamePlace | GameCard | GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) =>
    !funcs.map(func => func(highlight, draggedCard, gameSnapshot)).includes(false);


const hasRightNeighbour = (index: number, array: GameCard[]) => index < array.length -1;

const isOnlyCardInPlace = (array: GameCard[]) => array.length < 2;

const rightNeighbourIsEnchanted = (cardIndex: number, enchantmentsRow: GameCard[]) => enchantmentsRow.map(e => e.index).includes(cardIndex + 1);

const leftNeighbourIsEnchanted = (cardIndex: number, enchantmentsRow: GameCard[]) => enchantmentsRow.map(e => e.index).includes(cardIndex - 1);

//const rightNeighbourIsUnenchantable = (index: number, array: GameCard[]) => hasRightNeighbour(index, array) || rightNeighbourIsEnchanted(index, array);
const hasLeftNeighbour = (index: number) => index > 0;

const rightNeighbourIsEnchantable = (index: number, enchantmentsRow: GameCard[], GCZ: GameCard[]) => hasRightNeighbour(index, GCZ) && !rightNeighbourIsEnchanted(index, enchantmentsRow);

const leftNeighbourIsEnchantable = (index: number, array: GameCard[]) => hasLeftNeighbour(index) && !leftNeighbourIsEnchanted(index, array);

export const highlightNeighborCardEnchantable = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
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

//canEnchantWithBFF
export const canEnchantWithBFF = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted, highlightNeighborCardEnchantable);

//canEnchantWithZwilling Or With e.g. perplex
export const canEnchant = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardUnenchanted);

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

export const highlightCardCorrectType = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => true; //{
// eg "Polizei" only targets unwanteds, "Partyflüsterer" only guests
//const correctTypes = draggedCard.legalTargets[0].cardTypes
//};

export const canDestroy = allTrueWithArgs(ownerHighlightCardUnenchanted, highlightCardIsNotMine, highlightCardCorrectType, highlightCardUnenchanted);

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