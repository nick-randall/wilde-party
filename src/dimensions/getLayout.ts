import { range } from "ramda";
import { Store } from "redux";
import { widthOfRotated } from "../helperFunctions/equations";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import store from "../redux/store";

//const centerWidth = ()

// function toObservable(store: Store) {
//   return {
//     subscribe({ onNext } : {onNext: Function}) {
//       let dispose = store.subscribe(() => onNext(store.getState()));
//       onNext(store.getState());
//       return { dispose };
//     }
//   }
// }

export const getLayout = (id: string): { x: number; y: number } => {
  store.subscribe(() => store.getState())
  const { screenSize, gameSnapshot, dragUpdate, draggedHandCard } = store.getState();
  const { player, place } = locate(id, gameSnapshot);
  const dimensions = getAllDimensions(id);
  const { cardHeight, cardWidth,cardLeftSpread } = dimensions;
  const numCards = getNumCards(id, gameSnapshot);
  const draggedOver = draggedHandCard && dragUpdate.droppableId === id;
  const draggedOverCard = draggedOver ? 1 : 0;

  const fromCenterWidth = (distance: number): number => distance + (screenSize.width / 2 - ((numCards + draggedOverCard) * dimensions.cardWidth) / 2);
  const fromCenterHeight = (distance: number): number => distance + dimensions.GCZHeight;
  // TODO need a way to figure out how wide the cards are as they move outwards.
  const handFromCenterWidth = (distance: number): number => {
    const numHandCards = draggedHandCard ? numCards - 1 : numCards;
    const rotation = (index: number) => 10 * index - (numHandCards / 2 - 0.5) * 10;
    // const cards = range(0, numHandCards);
    // const rotations = cards.map((c, i) => rotation(i));
    // const widthsAfterRotation = rotations.map(deg => widthOfRotated(deg, cardWidth, cardHeight));
    // const handWidth = widthsAfterRotation.reduce((a, b) => a + b);
    const lastCardRotation = rotation(numCards - 1);
    const lastCardWidth = widthOfRotated(lastCardRotation, cardWidth, cardHeight)
    const handWidth2 = cardLeftSpread * numHandCards + lastCardWidth;
    return distance + (screenSize.width / 2 - handWidth2 / 2);
  };

  if (player === 0) {
    switch (place) {
      case "GCZ":
        return { x: fromCenterWidth(0), y: fromCenterHeight(0) };
      case "hand":
        return { x: handFromCenterWidth(0), y: fromCenterHeight(200) };
      case "specialsZone":
        return { x: fromCenterWidth(0), y: fromCenterHeight(-125) };
    }
  }
  return { x: 0, y: 0 };
};
