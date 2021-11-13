import { getCardGroupObjs } from "./groupGCZCards";

const myGCZCards: GameCard[] = [
  {
    id: "092832908423",
    name: "saufnase1",
    playerId: "l93fld9",
    placeId: "pd0s9fd",
    index: 0,
    image: "saufnase",
    cardType: "guest",
    pointValue: 1,
    bffs: false,
    zwilling: false,
    guestCardType: "saufnase", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },

  {
    id: "xxxasdfsdaf",
    name: "saufnase6",
    playerId: "l93fld9",
    placeId: "pd0s9fd",
    index: 1,
    image: "saufnase2",
    cardType: "guest",
    pointValue: 1,
    bffs: false,
    zwilling: false,
    guestCardType: "saufnase", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },

  {
    id: "01293219312832183",
    name: "taenzerin2",
    playerId: "l93fld9",
    placeId: "pd0s9fd",
    index: 2,
    image: "taenzerin2", //TODO change
    cardType: "guest",
    pointValue: 2,
    bffs: false,
    zwilling: false,
    guestCardType: "taenzerin", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
  {
    id: "50340395343",
    name: "schleckermaul6",
    playerId: "l93fld9",
    placeId: "pd0s9fd",
    index: 3,
    image: "schleckermaul6", //TODO change
    pointValue: 1,
    bffs: false,
    zwilling: false,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
  {
    id: "a953433",
    name: "schleckermaul",
    placeId: "pd0s9fd",
    playerId: "l93fld9",
    index: 4,
    image: "schleckermaul3", //TODO change
    pointValue: 1,
    bffs: false,
    zwilling: false,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
  {
    id: "fffff",
    name: "rumgroelerin2",
    placeId: "pd0s9fd",
    playerId: "l93fld9",
    index: 5,
    image: "rumgroelerin2", //TODO change
    pointValue: 1,
    bffs: false,
    zwilling: false,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
  {
    id: "kkkkkkkkk",
    name: "rumgroelerin",
    placeId: "pd0s9fd",
    playerId: "l93fld9",
    index: 6,
    image: "rumgroelerin", //TODO change
    pointValue: 1,
    bffs: false,
    zwilling: false,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
  {
    id: "hosey",
    name: "rumgroelerin3",
    placeId: "pd0s9fd",
    playerId: "l93fld9",
    index: 7,
    image: "rumgroelerin3", 
    pointValue: 1,
    bffs: false,
    zwilling: false,
    cardType: "guest",
    guestCardType: "rumgroelerin",
     action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
];

const myEnchantmentsRowCards: GameCard[] | null[] = [
  
  {
    id: "asdf2r42345",
    name: "zwilling2",
    placeId: "324562132300",
    playerId: "l93fld9",
    index: 1,
    pointValue: 1,
    bffs: false,
    zwilling: false,
    image: "zwilling",
    cardType: "zwilling",
     action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest" },
  },
  {
    id: "3w3323434",
    name: "bffs5",
    placeId: "324562132300",
    playerId: "l93fld9",
    index: 3,
    pointValue: 1,
    bffs: false,
    zwilling: false,
    image: "bffs2",
    cardType: "bff",
     action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest" },
  },
];

export const myGCZCardRow = getCardGroupObjs(myEnchantmentsRowCards, myGCZCards)