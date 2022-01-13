import { v4 as uuidv4 } from "uuid";

const createDestroyCards = (): GameCard[] => {
  const numDestroyCarsPerType = 2;
  let destroyCards: GameCard[] = [];
  for (let i = 0; i < numDestroyCarsPerType + 1; i++) {
    const nachbarin: GameCard = {
      id: uuidv4(),
      name: `nachbarin${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `nachbarin`,
      pointValue: 0,
      cardType: "instant",
      action: { actionType: "destroy", highlightType: "card", targetPlayerType: "enemy" },
    };
    destroyCards.push(nachbarin);
    const polizei: GameCard = {
      id: uuidv4(),
      name: `polizei${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `polizei`,
      pointValue: 0,
      cardType: "instant",
      action: { actionType: "destroy", highlightType: "card", targetPlayerType: "enemy" },
    };
    destroyCards.push(polizei);
  
  }
  return destroyCards;
};

export default createDestroyCards;
