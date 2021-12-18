import { lte, range } from "ramda";
import { Store } from "redux";
import { widthOfRotated, widthOfRotated2 } from "../helperFunctions/equations";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { getSpecialsOfType, sortSpecials2 } from "../helperFunctions/getSpecialsOfType";
import { getNumCards, locate } from "../helperFunctions/locateFunctions";
import store from "../redux/store";
import { getDimensionsFromSnapshot } from "./getDimensionsFromSnapshot";


export const getLayoutWithSnapshot = (id: string, gameSnapshot: GameSnapshot, screenSize: {width: number, height: number}): { x: number; y: number } => {
  const { player, place } = locate(id, gameSnapshot);
  const dimensions = getDimensionsFromSnapshot(id, gameSnapshot);
  const { cardHeight, cardWidth, cardLeftSpread } = dimensions;
  const numCards = getNumCards(id, gameSnapshot);

  let numCardsWidth = numCards;
  if ((place === "specialsZone" || place === "UWZ") && player !== null) {
    const specialsZoneCards = gameSnapshot.players[player].places["specialsZone"].cards;
    const numSpecialsColumns = sortSpecials2(specialsZoneCards).length;
    const numUWZColumns = 1//gameSnapshot.players[player].places["UWZ"].cards.length > 0 ? 0 : 1;
    numCardsWidth = numSpecialsColumns + numUWZColumns;
  }

  const fromCenterWidth = (distance: number): number =>
    distance + (screenSize.width / 2 - ((numCardsWidth ) * dimensions.cardWidth) / 2);
  //const specialsZoneFromCenterWidth =  (distance: number): number => distance + (screenSize.width / 2 - ((sortSpecials2() + draggedOverCard) * dimensions.cardWidth) / 2);
  const fromCenterHeight = (distance: number): number => distance + (screenSize.height / 2 - dimensions.cardHeight / 2);
  // TODO need a way to figure out how wide the cards are as they move outwards.
  const handFromCenterWidth = (distance: number): number => {
    
    const rotation = (index: number) => 10 * index - (numCards / 2 - 0.5) * 10;
    for (let i = 0; i < numCards; i++) {
    //    console.log(widthOfRotated2(rotation(i), cardWidth, cardHeight));
    }
    const firstCardRotation = rotation(1);
    // console.log(firstCardRotation);
    const firstCardWidth = widthOfRotated(-firstCardRotation, cardWidth, cardHeight);
    // console.log(cardHeight, cardLeftSpread);
    const cardsWiderThanUnRotated = firstCardWidth - cardWidth;
    // console.log(firstCardWidth);
    // console.log(document.getElementById("3w3323434")?.getBoundingClientRect().left);
    // console.log(document.getElementById("gogogogo")?.getBoundingClientRect().right);
    // console.log(cardsWiderThanUnRotated);
    const handWidth = (numCards - 1) * cardLeftSpread - firstCardWidth;
    const hw = (numCards - 1) * cardLeftSpread - cardWidth;

    return distance + (screenSize.width / 2 - handWidth / 2);
  };
  const handFromBottom = (distance: number) => screenSize.height - dimensions.cardHeight - distance;

  if (player === 0) {
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
  return { x: 0, y: 0 };
};
