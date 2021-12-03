import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import store from "../redux/store";

//const centerWidth = ()

export const getLayout = (id: string): { x: number; y: number } => {
  const { screenSize, gameSnapshot, dragUpdate, draggedHandCard } = store.getState();
  const { player, place } = locate(id, gameSnapshot);
  const dimensions = getAllDimensions(id);
  const numCards = getNumCards(id, gameSnapshot);
  const draggedOver = draggedHandCard && dragUpdate.droppableId === id;
  const draggedOverCard = draggedOver ? 1 : 0;

  const fromCenterWidth = (distance: number): number => distance + (screenSize.width / 2 - ((numCards + draggedOverCard) * dimensions.cardWidth) / 2);
  const fromCenterHeight = (distance: number): number => distance + dimensions.GCZHeight;
  // TODO need a way to figure out how wide the cards are as they move outwards.
  const handFromCenterWidth = (distance: number): number => distance + (screenSize.width / 2 - ((numCards + draggedOverCard) * 70) / 2);

  if (player === 0) {
    switch (place) {
      case "GCZ":
        return { x: fromCenterWidth(0), y: fromCenterHeight(-100) };
      case "hand":
        return { x: handFromCenterWidth(200), y: fromCenterHeight(200) };
    }
  }
  return { x: 0, y: 0 };
};
