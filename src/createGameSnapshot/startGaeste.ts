import { v4 as uuidv4 } from "uuid";
import shuffle from "../helperFunctions/shuffle";

const getStartingGuests = () : GameCard[] => { 
  let startingGuests: GameCard[]  = [
  {
    id: uuidv4(),
    name: "startgast_saufnase",
    playerId: "",
    placeId: "",
    index: 0,
    image: "startgast_saufnase",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: uuidv4(),
    name: "startgast_taenzerin",
    playerId: "",
    placeId: "",
    index: 1,
    image: "startgast_taenzerin", //TODO change
    cardType: "guest",
    pointValue: 1,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: uuidv4(),
    name: "startgast_rumgroelerin",
    placeId: "",
    playerId: "",
    index: 0,
    image: "startgast_rumgroelerin", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: uuidv4(),
    name: "startgast_schleckermaul",
    playerId: "",
    placeId: "",
    index: 2,
    image: "startgast_schleckermaul", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: uuidv4(),
    name: "startgast_unscheinbar",
    playerId: "",
    placeId: "",
    index: 2,
    image: "startgast_unscheinbar", //TODO change
    pointValue: 1,
    cardType: "guest",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
];
return shuffle(startingGuests);

}
// export const prepStartGast = (card: GameCard, playerId: string, GCZId: string): GameCard => ({ ...card, placeId: GCZId, playerId: playerId });

export default getStartingGuests;
