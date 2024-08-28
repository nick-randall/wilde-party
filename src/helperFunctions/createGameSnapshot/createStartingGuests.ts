import { v4 as uuidv4 } from "uuid";
import shuffle from "../shuffle";

const getCurrCardId = (currCardId: number) => currCardId++;

const createStartingGuests = (numPlayers: number, currCardId: number) : GameCard[] => { 
  let startingGuests: GameCard[]  = [
  {
    id: getCurrCardId(currCardId),
    name: "startgast_saufnase",
    playerId: -1,
    placeId: -1,
    index: 0,
    image: "startgast_saufnase",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: getCurrCardId(currCardId),
    name: "startgast_taenzerin",
    playerId: -1,
    placeId: -1,
    index: 1,
    image: "startgast_taenzerin", //TODO change
    cardType: "guest",
    pointValue: 1,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: getCurrCardId(currCardId),
    name: "startgast_rumgroelerin",
    placeId: -1,
    playerId: -1,
    index: 0,
    image: "startgast_rumgroelerin", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: getCurrCardId(currCardId),
    name: "startgast_schleckermaul",
    playerId: -1,
    placeId: -1,
    index: 2,
    image: "startgast_schleckermaul", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: getCurrCardId(currCardId),
    name: "startgast_unscheinbar",
    playerId: -1,
    placeId: -1,
    index: 2,
    image: "startgast_unscheinbar", //TODO change
    pointValue: 1,
    cardType: "guest",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
];
const shuffledStartingGuests = shuffle(startingGuests)
return shuffledStartingGuests.slice(0, numPlayers);

}
// export const prepStartGast = (card: GameCard, playerId: string, GCZId: string): GameCard => ({ ...card, placeId: GCZId, playerId: playerId });

export default createStartingGuests;
