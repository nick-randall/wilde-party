import { getAllGuestCards, getAllPlayerPlaces, getAllPlayers } from "./getHighlightsOfType";
import {  getPlaceFunctions, getPlayerFunctions } from "./highlightFunctions";
import * as R from "ramda";
import { getCardFunctions } from "./cardHighlightFunctions";

export const getHighlights = (draggedCard: GameCard, gameSnapshot: GameSnapshot) => {
  //const gameSnapshot = store.getState().gameSnapshot;
  const { action } = draggedCard;
  const { highlightType } = action;

  if (highlightType === "guestCard") return getCardHighlights(draggedCard, gameSnapshot)
  else if (highlightType === "place") return getPlaceHighlights(draggedCard, gameSnapshot)
  else return getPlayerHighlights(draggedCard, gameSnapshot)
};

const getCardHighlights = (draggedCard: GameCard, gameSnapshot: GameSnapshot): string[] => {
  const { action } = draggedCard;
  const { actionType } = action;

  const highlightFunction = getCardFunctions(actionType);
  const potentialHighlights: GameCard[] = getAllGuestCards(gameSnapshot)
  const highlights = potentialHighlights.filter(e => highlightFunction(e, draggedCard, gameSnapshot));
  return highlights.map((e) => R.prop("id", e))
};

const getPlaceHighlights = (draggedCard: GameCard, gameSnapshot: GameSnapshot): string[] => {
  const { action } = draggedCard;
  const { actionType } = action;

  const highlightFunction = getPlaceFunctions(actionType);
  const potentialHighlights = getAllPlayerPlaces(gameSnapshot)
  console.log(potentialHighlights)
  const highlights = potentialHighlights.filter(e => highlightFunction(e, draggedCard, gameSnapshot));
  return highlights.map((e) => R.prop("id", e))
};

const getPlayerHighlights = (draggedCard: GameCard, gameSnapshot: GameSnapshot): string[] => {
  const { action } = draggedCard;
  const { actionType } = action;

  const highlightFunction = getPlayerFunctions(actionType);
  const potentialHighlights = getAllPlayers(gameSnapshot)
  const highlights = potentialHighlights.filter(e => highlightFunction(e, draggedCard, gameSnapshot));
  return highlights.map((e) => R.prop("id", e))
};