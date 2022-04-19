import { createDeck, setDeckIndexes, setDeckPlaceId } from "./createDeck";
import shuffle from "../helperFunctions/shuffle";

export const GCZCards: GameCard[] = [
  {
    id: "einfachRonny",
    name: `einfach1`,
    placeId: "",
    playerId: "",
    index: 0,
    image: `einfach1`,
    pointValue: 1,
    cardType: "guest",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "zwilling1Steven",
    name: `zwilling1`,
    placeId: "",
    playerId: "",
    index: 0,
    image: `zwilling`,
    pointValue: 0,
    cardType: "zwilling",
    action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: "rumgroelerDrunkAtFiveClive",
    name: `rumgroelerin1`,
    placeId: "",
    playerId: "",
    index: 0,
    image: `rumgroelerin1`,
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "saufnaseNoseDrinker",
    name: `saufnase1`,
    placeId: "",
    playerId: "",
    index: 0,
    image: `saufnase1`,
    pointValue: 1,
    cardType: "guest",
    guestCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "bffs1Johnny",
    name: `bffs1`,
    placeId: "",
    playerId: "",
    index: 0,
    image: `bffs`,
    pointValue: 0,
    cardType: "bff",
    action: { actionType: "enchantWithBff", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: "unscheinbarRex",
    name: `unscheinbar1`,
    placeId: "",
    playerId: "",
    index: 0,
    image: `unscheinbar1`,
    pointValue: 1,
    cardType: "guest",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },


];


export const getSampleDeck = () : { deck: GameCard[]; deckId: string } => {
  const deckId = "uuidv4(";
  let deck = createDeck();
  let shuffledDeck = shuffle(deck);
  shuffledDeck = GCZCards.concat(shuffledDeck)
  const withIndexes = setDeckIndexes(shuffledDeck);
  const withPlaceId = setDeckPlaceId(withIndexes, deckId);
  return {deck: withPlaceId, deckId: deckId}
}
