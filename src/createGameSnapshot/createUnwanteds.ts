import { v4 as uuidv4 } from "uuid";

const createUnwanteds = (): GameCard[] => {
  const numUnwantedGuestsPerType = 4;

  let unwanteds: GameCard[] = [];
  for (let i = 0; i < numUnwantedGuestsPerType + 1; i++) {
    const musikfuersichalleinebeansprucherin: GameCard = {
      id: uuidv4(),
      name: `musikfuersichalleinebeansprucherin${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `musikfuersichalleinebeansprucherin`,
      pointValue: -1,
      cardType: "unwanted",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
    };
    unwanteds.push(musikfuersichalleinebeansprucherin);

    const nachbarin: GameCard = {
      id: uuidv4(),
      name: `nachbarin${i}`,
      placeId: "",
      playerId: "", 
      index: 0,
      image: `nachbarin`,
      pointValue: -1,
      cardType: "unwanted",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
    };
    unwanteds.push(nachbarin);
  }

  return unwanteds;
};

export default createUnwanteds