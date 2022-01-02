import { lte, range } from "ramda";
import { Store } from "redux";
import { widthOfRotated } from "../helperFunctions/equations";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getSpecialsOfType, sortSpecials2 } from "../helperFunctions/getSpecialsOfType";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import store, { RootState } from "../redux/store";

const isPlayerAvatar = (gameSnapshot: GameSnapshot, playerId: string) => gameSnapshot.players.map(p => p.id).includes(playerId);

export const getLayout = (id: string, screenSize: { width: number; height: number }, state: RootState | null = null): { x: number; y: number } => {
  if (state === null) state = store.getState();
  const { gameSnapshot, dragUpdate, draggedHandCard } = state;

  let { player, place } = locate(id, gameSnapshot);

  const dimensions = getAllDimensions(id, gameSnapshot);
  const { cardHeight, cardWidth, cardLeftSpread } = dimensions;
  let numCards = getNumCards(id, gameSnapshot);
  const draggedOver = draggedHandCard && dragUpdate.droppableId === id;
  let draggedOverCard = draggedOver ? 1 : 0;

  let numCardsWidth = numCards;
  if ((place === "specialsZone" || place === "UWZ") && player !== null) {
    const specialsZoneCards = gameSnapshot.players[player].places["specialsZone"].cards;
    const numSpecialsColumns = sortSpecials2(specialsZoneCards).length;
    const numUWZColumns = 1; //gameSnapshot.players[player].places["UWZ"].cards.length > 0 ? 0 : 1;
    numCardsWidth = numSpecialsColumns + numUWZColumns;
  }
  if (place === "UWZ") draggedOverCard = 0;
  if (place === "deck") numCards = 0;

  const fromCenterWidth = (distance: number): number =>
    distance + (screenSize.width / 2 - ((numCardsWidth + draggedOverCard) * dimensions.cardWidth) / 2);
  const fromCenterHeight = (distance: number): number => distance + (screenSize.height / 2 - dimensions.cardHeight / 2);
  const fromRight = (distance: number) => screenSize.width - distance;
  const fromBottom = (distance: number) => screenSize.height - distance;

  const handFromCenterWidth = (distance: number): number => {
    const hww = (cardLeftSpread / 2 - 0.5) * numCards; //(numCards - 1)

    return distance + (screenSize.width / 2 - hww / 2);
  };
  const handFromBottom = (distance: number) => screenSize.height - dimensions.cardHeight - distance;

  if (player === 0) {
    if (isPlayerAvatar(gameSnapshot, id)) {
      return { x: 50, y: 50 };
    } else console.log(gameSnapshot.players.map);
    switch (place) {
      case "specialsZone":
        return { x: fromCenterWidth(0 + cardWidth), y: fromCenterHeight(-cardHeight) };
      case "UWZ":
        return { x: fromCenterWidth(0), y: fromCenterHeight(-cardHeight) };
      case "GCZ":
        return { x: fromCenterWidth(0), y: fromCenterHeight(0) };
      case "hand":
        return { x: handFromCenterWidth(0), y: handFromBottom(30) };
    }
  }
  if (player === null) {
    switch (place) {
      case "deck":
        return { x: fromRight(200), y: fromCenterHeight(0) };
    }
  }
  return { x: 0, y: 0 };
};
