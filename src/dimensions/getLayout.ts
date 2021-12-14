import { range } from "ramda";
import { Store } from "redux";
import { widthOfRotated } from "../helperFunctions/equations";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getSpecialsOfType, sortSpecials2 } from "../helperFunctions/getSpecialsOfType";
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
  store.subscribe(() => store.getState());
  const { screenSize, gameSnapshot, dragUpdate, draggedHandCard } = store.getState();
  const { player, place } = locate(id, gameSnapshot);
  const dimensions = getAllDimensions(id);
  const { cardHeight, cardWidth, cardLeftSpread } = dimensions;
  const numCards = getNumCards(id, gameSnapshot);
  const draggedOver = draggedHandCard && dragUpdate.droppableId === id;
  const draggedOverCard = draggedOver ? 1 : 0;

  const fromCenterWidth = (distance: number): number => distance + (screenSize.width / 2 - ((numCards + draggedOverCard) * dimensions.cardWidth) / 2);
  //const specialsZoneFromCenterWidth =  (distance: number): number => distance + (screenSize.width / 2 - ((sortSpecials2() + draggedOverCard) * dimensions.cardWidth) / 2);
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
    const lastCardWidth = widthOfRotated(lastCardRotation, cardWidth, cardHeight);
    const handWidth2 = cardLeftSpread * numHandCards + lastCardWidth;
    return distance + (screenSize.width / 2 - handWidth2 / 2);
  };
  const handFromBottom = (distance: number) => screenSize.height - dimensions.cardHeight - distance;

  if (player === 0) {
    switch (place) {
      case "specialsZone":
        return { x: 400, y: fromCenterHeight(-dimensions.cardHeight-38) };
        case "UWZ":
          return { x: 690, y: fromCenterHeight(-64) };
      case "GCZ":
        return { x: 400, y: fromCenterHeight(0) };
      case "hand":
        return { x: handFromCenterWidth(0), y: handFromBottom(30) };
    }
  }
  return { x: 0, y: 0 };
};
