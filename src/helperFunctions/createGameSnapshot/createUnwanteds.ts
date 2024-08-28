import { get } from "http";
import { v4 as uuidv4 } from "uuid";

const getCurrCardId = (currCardId: number) => currCardId++;

const createUnwanteds = (currCardId: number): GameCard[] => {

  const numUnwantedGuestsPerType = 4;

  let unwanteds: GameCard[] = [];
  for (let i = 0; i < numUnwantedGuestsPerType + 1; i++) {
    const musikfuersichalleinebeansprucherin: GameCard = {
      id: getCurrCardId(currCardId),
      name: `musikfuersichalleinebeansprucherin${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      image: `musikfuersichalleinebeansprucherin`,
      pointValue: -1,
      cardType: "unwanted",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
    };
    unwanteds.push(musikfuersichalleinebeansprucherin);

    const quasselstrippe: GameCard = {
      id: getCurrCardId(currCardId),
      name: `quasselstrippe${i}`,
      placeId: -1,
      playerId: -1, 
      index: 0,
      image: `quasselstrippe`,
      pointValue: -1,
      cardType: "unwanted",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
    };
    unwanteds.push(quasselstrippe);
  }

  return unwanteds;
};

export default createUnwanteds