const numGuestCardsPerType = 5;
const numUnscheinbar = 4;
const guestCardTypes: GuestCardType[] = ["rumgroelerin", "saufnase", "schleckermaul", "taenzerin"];
const rumGroelerinSpecials = ["megaphon", "karaoke", "heliumballon", "meinsong", "smile"];
const saufnaseSpecials = ["shots", "beerpong", "prost", "raucherzimmer", "barkeeperin"];
const schleckermaulSpecials = ["eisimbecher", "suessigkeiten", "midnightsnack", "fingerfood", "partypizza"];
const taenzerinSpecials = ["nebelmaschine", "lichtshow", "discokugel", "poledance", "playlist"];

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
//unscheinbar

const getRandomId = () => {};


export const createDeck = () => {
  const deck: GameCard[] = []
  for (let guestCardType of guestCardTypes) {
    for (let i = 0; i < numGuestCardsPerType; i++) {
      const guestCard: GameCard = {
        id: "hosey",
        name: `${guestCardType}${i}`,
        placeId: "klasdf",
        playerId: "l93fld9",
        index: 0,
        image: `${guestCardType}${i}`,
        pointValue: 1,
        cardType: "guest",
        guestCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
      };
      deck.push(guestCard)

      

      //for (let i = 0; i < guestCardTypes.length; i++) {}
    }
    const specialsOfThisType = specials[guestCardType];

    for (let special of specialsOfThisType) {
      const specialsCard: GameCard = {
        id: "alsvdknnakvos",
        name: `${special}`,
        playerId: "",
        placeId: "klasd02mcvdlw",
        index: 0,
        image: `${special}`, 
        cardType: "special",
        pointValue: 0,
        guestCardType: `${guestCardType}`, 
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
      };
      deck.push(specialsCard)
    }
  }
  return deck;
};
const shuffle = () => {};

// fix place and player ids

export const deal = (cards: GameCard[]) => {};

// const setDeckIndexes = () ={}

