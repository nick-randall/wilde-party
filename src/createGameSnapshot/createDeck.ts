import { v4 as uuidv4 } from "uuid";
import shuffle from "../helperFunctions/shuffle";

const numGuestCardsPerType = 5;
const numUnscheinbar = 4;
const guestCardTypes: GuestCardType[] = ["rumgroelerin", "saufnase", "schleckermaul", "taenzerin"];
interface Specials {
  [name: string]: string[];
}

const specials: Specials = {
  rumgroelerin: ["megaphon", "karaoke", "heliumballon", "meinsong", "smile"],
  saufnase: ["shots", "beerpong", "prost", "raucherzimmer", "barkeeperin"],
  schleckermaul: ["eisimbecher", "suessigkeiten", "midnightsnack", "fingerfood", "partypizza"],
  taenzerin: ["nebelmaschine", "lichtshow", "discokugel", "poledance", "playlist"],
};

//startgast

export const createDeck = () => {
  const deck: GameCard[] = [];

  for (let i = 0; i < numUnscheinbar; i++) {
    const unscheibarerGast: GameCard = {
      id: uuidv4(),
      name: `unscheinbar${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `unscheinbar${i}`,
      pointValue: 1,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
    };
    deck.push(unscheibarerGast);
  }
  for (let i = 0; i < numGuestCardsPerType; i++) {
    const einfacherGuestCard: GameCard = {
      id: uuidv4(),
      name: `einfach${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `einfach${i}`,
      pointValue: 1,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
    };
    deck.push(einfacherGuestCard);
    const doppelterGuestCard: GameCard = {
      id: uuidv4(),
      name: `doppelt${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `doppelt${i}`,
      pointValue: 2,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
    };
    deck.push(doppelterGuestCard);


  }


  for (let guestCardType of guestCardTypes) {
    for (let i = 0; i < numGuestCardsPerType; i++) {
      const guestCard: GameCard = {
        id: uuidv4(),
        name: `${guestCardType}${i}`,
        placeId: "",
        playerId: "",
        index: 0,
        image: `${guestCardType}${i}`,
        pointValue: 1,
        cardType: "guest",
        guestCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
      };
      deck.push(guestCard);
    }
    const specialsOfThisType = specials[guestCardType];

    for (let special of specialsOfThisType) {
      const specialsCard: GameCard = {
        id: uuidv4(),
        name: `${special}`,
        playerId: "",
        placeId: "",
        index: 0,
        image: `${special}`,
        cardType: "special",
        pointValue: 0,
        specialsCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
      };
      deck.push(specialsCard);
    }
  }
  return deck;
};


const setDeckIndexes = (deck: GameCard[]) => deck.map((card, i) => ({...card, index: i}))

const setDeckPlaceId = (deck: GameCard[], deckId: string) => deck.map((card) => ({...card, placeId: deckId}))

export const getPreppedDeck = () => {
  const deckId = uuidv4();
  let deck = createDeck();
  const shuffledDeck = shuffle(deck);
  const withIndexes = setDeckIndexes(shuffledDeck);
  const withPlaceId = (setDeckPlaceId(withIndexes, deckId))
  return {deck: withPlaceId, deckId: deckId};
};

// fix place and player ids

export const deal = (cards: GameCard[]) => {};

// const setDeckIndexes = () ={}
