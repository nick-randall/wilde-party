import { v4 as uuidv4 } from "uuid";

const getCurrCardId = (currCardId: number) => currCardId+= 297;
const createDestroyCards = (currCardId: number): GameCard[] => {
  const numDestroyCarsPerType = 2;
  let destroyCards: GameCard[] = [];
  for (let i = 0; i < numDestroyCarsPerType + 1; i++) {
    const nachbarin: GameCard = {
      id: Math.floor(Math.random() * 10000000000000),
      name: `nachbarin${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      image: `nachbarin`,
      pointValue: 0,
      cardType: "instant",
      action: { actionType: "destroy", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "enemy" },
    };
    destroyCards.push(nachbarin);
    const polizei: GameCard = {
      id: Math.floor(Math.random() * 10000000000000),
      name: `polizei${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      image: `polizei`,
      pointValue: 0,
      cardType: "instant",
      action: { actionType: "destroy", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "enemy" },
    };
    destroyCards.push(polizei);
  
  }
  return destroyCards;
};

export default createDestroyCards;
