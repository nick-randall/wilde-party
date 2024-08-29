import { v4 as uuidv4 } from "uuid";


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

const getCardId = (currCardId: number) => currCardId++;

//startgast
const createSpecialsAndGuests = (currCardId: number) => {

  let specialsAndGuests: GameCard [] = [];
  for (let i = 0; i < numUnscheinbar; i++) {
    const unscheibarerGast: GameCard = {
      id: getCardId(currCardId),
      name: `unscheinbar${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      image: `unscheinbar${i}`,
      pointValue: 1,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
    };
    specialsAndGuests.push(unscheibarerGast);
  }
  for (let i = 0; i < numGuestCardsPerType; i++) {
    const einfacherGuestCard: GameCard = {
      id: getCardId(currCardId),
      name: `einfach${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      image: `einfach${i}`,
      pointValue: 1,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
    };
    specialsAndGuests.push(einfacherGuestCard);
    const doppelterGuestCard: GameCard = {
      id: getCardId(currCardId),
      name: `doppelt${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      image: `doppelt${i}`,
      pointValue: 2,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
    };
    specialsAndGuests.push(doppelterGuestCard);
  }

  for (let guestCardType of guestCardTypes) {
    for (let i = 0; i < numGuestCardsPerType; i++) {
      const guestCard: GameCard = {
        id: getCardId(currCardId),
        name: `${guestCardType}${i}`,
        placeId: -1,
        playerId: -1,
        index: 0,
        image: `${guestCardType}${i}`,
        pointValue: 1,
        cardType: "guest",
        guestCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
      };
      specialsAndGuests.push(guestCard);
    }
    const specialsOfThisType = specials[guestCardType];

    for (let special of specialsOfThisType) {
      const specialsCard: GameCard = {
        id: getCardId(currCardId),
        name: `${special}`,
        playerId: -1,
        placeId: -1,
        index: 0,
        image: `${special}`,
        cardType: "special",
        pointValue: 0,
        specialsCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
      };
      specialsAndGuests.push(specialsCard);
    }
  }
  return specialsAndGuests;
};

export default createSpecialsAndGuests;