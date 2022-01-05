import { getAllDimensions } from "../helperFunctions/getDimensions";
import { sortSpecials2 } from "../helperFunctions/getSpecialsOfType";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import store, { RootState } from "../redux/store";

export const getPlacesLayout = (
  id: string,
  playerZoneSize: { width: number; height: number },
  state: RootState | null = null
): { x: number; y: number } => {
  if (state === null) state = store.getState();
  const { gameSnapshot, dragUpdate, draggedHandCard } = state;
  const { player, place } = locate(id, gameSnapshot);
  const { cardHeight, cardWidth, cardLeftSpread } = getAllDimensions(id, gameSnapshot);
  let numCards = getNumCards(id, gameSnapshot);
  const draggedOver = draggedHandCard && dragUpdate.droppableId === id;
  let draggedOverCard = draggedOver ? 1 : 0;

  let numCardsWidth = numCards;
  if ((place === "specialsZone" || place === "UWZ") && player !== null) {
    const specialsZoneCards = gameSnapshot.players[player].places["specialsZone"].cards;
    const numSpecialsColumns = sortSpecials2(specialsZoneCards).length;
    // Always one UWZ column only
    const numUWZColumns = 1;
    numCardsWidth = numSpecialsColumns + numUWZColumns;
  }
  if (place === "UWZ") draggedOverCard = 0;
  if (place === "deck") numCards = 0;

  const fromCenterWidth = (distance: number): number => distance + (playerZoneSize.width / 2 - ((numCardsWidth + draggedOverCard) * cardWidth) / 2);
  const fromCenterHeight = (distance: number): number => distance + (playerZoneSize.height / 2 - cardHeight / 2);
  const fromRight = (distance: number) => playerZoneSize.width - distance;
  const handFromCenterWidth = (distance: number): number => {
    const handWidth = (cardLeftSpread / 2 - 0.5) * numCards;
    return distance + (playerZoneSize.width / 2 - handWidth / 2);
  };
  const handFromBottom = (distance: number) => playerZoneSize.height - cardHeight - distance;

  switch (place) {
    case "specialsZone":
      return { x: fromCenterWidth(0 + cardWidth), y: fromCenterHeight(-cardHeight) };
    case "UWZ":
      return { x: fromCenterWidth(0), y: fromCenterHeight(-cardHeight) };
    case "GCZ":
      return { x: fromCenterWidth(0), y: fromCenterHeight(0) };
    case "hand":
      return { x: handFromCenterWidth(0), y: handFromBottom(30) };
    case "deck":
      return { x: fromCenterWidth(cardWidth/2), y: fromCenterHeight(0) };
  }

  return { x: 0, y: 0 };
};
