// Sort Queries by index so the array structure reflects the
const myGCZCards: GameCard[] = [
  {
    id: "092832908423",
    name: "saufnase1",
    playerId: "l93fld9",
    placeId: "pd0s9fd",
    index: 0,
    image: "saufnase0",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
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
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
];

export const myHandCards: GameCard[] = [
  {
    id: "3w3323434",
    name: "bffs5",
    placeId: "324562132300",
    playerId: "l93fld9",
    index: 0,
    pointValue: 1,
    image: "bffs",
    cardType: "bff",
    action: { actionType: "enchantWithBff", highlightType: "guestCard", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: "asdf",
    name: "musikfuersichalleinebeansprucherin",
    placeId: "324562132300",
    playerId: "l93fld9",
    index: 1,
    pointValue: 0,
    image: "musikfuersichalleinebeansprucherin",
    cardType: "unwanted",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
  },
  // {
  //   id: "9d2304jf",
  //   name: "partypizza",
  //   placeId: "klsjfd",
  //   playerId: "l93fld9",
  //   index: 1,
  //   pointValue: 0,
  //   image: "partypizza",
  //   cardType: "special",
  //   specialsCardType: "schleckermaul",
  //   action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  // },
  {
    id: "jadsif293jfnjskdnv",
    name: "schleckermaul4",
    playerId: "l93fld9",
    placeId: "pqewoi",
    index: 2,
    image: "schleckermaul4",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "123123",
    name: "barkeeperin",
    placeId: "pqewoi",
    playerId: "l93fld9",
    index: 3,
    pointValue: 1,
    image: "barkeeperin",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: "asdf2r42345",
    name: "zwilling2",
    placeId: "324562132300",
    playerId: "l93fld9",
    index: 4,
    pointValue: 1,
    image: "zwilling",
    cardType: "zwilling",
    action: { actionType: "enchant", highlightType: "guestCard", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: "fffff",
    name: "rumgroelerin2",
    placeId: "pd0s9fd",
    playerId: "l93fld9",
    index: 5,
    image: "rumgroelerin2", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "mbv",
    name: "quasselstrippe1",
    placeId: "0239842kl",
    playerId: "l93fld9",
    index: 6,
    pointValue: 0,
    image: "quasselstrippe",
    cardType: "unwanted",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
  },
];
export const myEnchantmentsRowCards: GameCard[] = [
  // {
  //   id: "asdf2r42345",
  //   name: "zwilling2",
  //   placeId: "324562132300",
  //   playerId: "l93fld9",
  //   index: 1,
  //   pointValue: 1,
  //   image: "zwilling",
  //   cardType: "zwilling",
  //   action: { actionType: "enchant", highlightType: "guestCard", cardHighlightType: "guest" },
  // },
];

const mySpecialsZoneCards: GameCard[] = [
  {
    id: "mnbvyxcv",
    name: "nebelmaschine",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 1,
    pointValue: 0,
    image: "nebelmaschine",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: "pppppppf1",
    name: "playlist",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 2,
    pointValue: 0,
    image: "playlist",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },

  {
    id: "pppppppf2",
    name: "prost",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 4,
    pointValue: 0,
    image: "prost",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
];

const myUWZCards: GameCard[] = [];

const player1HandCards: GameCard[] = [
  {
    id: "kkkkkkkkk",
    name: "rumgroelerin0",
    placeId: "2kopvjops",
    playerId: "enemy",
    index: 0,
    image: "rumgroelerin0", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "01293219312832183",
    name: "taenzerin2",
    playerId: "enemy",
    placeId: "2kopvjops",
    index: 1,
    image: "taenzerin2", //TODO change
    cardType: "guest",
    pointValue: 2,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "50340395343",
    name: "schleckermaul2",
    playerId: "enemy",
    placeId: "2kopvjops",
    index: 2,
    image: "schleckermaul2", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "a953433",
    name: "schleckermaul",
    placeId: "2kopvjops",
    playerId: "enemy",
    index: 3,
    image: "schleckermaul3", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
];

const player1GCZCards: GameCard[] = [
  {
    id: "hosey",
    name: "rumgroelerin4",
    placeId: "2kopvjops",
    playerId: "enemy",
    index: 0,
    image: "rumgroelerin4",
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
];

const deckCards: GameCard[] = [
  {
    id: "gogogogo",
    name: "megaphon",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 0,
    pointValue: 0,
    image: "megaphon",
    cardType: "special",
    specialsCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: "hosey",
    name: "rumgroelerin3",
    placeId: "pd0s9fd",
    playerId: "l93fld9",
    index: 1,
    image: "rumgroelerin3",
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  
];
const discardPileCards: GameCard[] = [
  {
    id: "alsvdknnakvos",
    name: "discokugel",
    playerId: "",
    placeId: "klasd02mcvdlw",
    index: 0,
    image: "discokugel", //TODO change
    cardType: "special",
    pointValue: 0,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
];

export const initialGamePlayers: GamePlayer[] = [
  {
    id: "l93fld9",
    name: "Nick",
    places: {
      GCZ: {
        id: "pd0s9fd",
        playerId: "l93fld9",
        placeType: "GCZ",
        acceptedCardType: "guest",
        cards: myGCZCards,
      },
      UWZ: {
        id: "0239842kl",
        playerId: "l93fld9",
        placeType: "UWZ",
        acceptedCardType: "unwanted",
        cards: myUWZCards,
      },
      specialsZone: {
        id: "klsjfd",
        playerId: "l93fld9",
        placeType: "specialsZone",
        acceptedCardType: "special",

        cards: mySpecialsZoneCards,
      },
      hand: {
        id: "pqewoi",
        playerId: "l93fld9",
        placeType: "hand",
        cards: myHandCards,
      },
      enchantmentsRow: {
        id: "324562132300",
        playerId: "l93fld9",
        placeType: "enchantmentsRow",
        cards: myEnchantmentsRowCards,
      },
    },
    current: true,
    currentPhase: "normalPhase",
    draws: 1,
    plays: 1,
    rolls: 1,
    //points:number;//??????
    glitzaglitza: false,
    skipNextTurn: false,
  },
];

export const initialGameSnapshot: GameSnapshot = {
  current: {
    player: 0,
    phase: "normalPhase",
    draws: 1,
    plays: 1,
    rolls: 1,
  },
  players: [
    {
      id: "l93fld9",
      name: "Nick",
      current: true,
      currentPhase: "normalPhase",
      draws: 1,
      plays: 1,
      rolls: 1,
      //points:number,//??????
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: "pd0s9fd",
          playerId: "l93fld9",
          placeType: "GCZ",
          acceptedCardType: "guest",
          cards: myGCZCards,
        },
        UWZ: {
          id: "0239842kl",
          playerId: "l93fld9",
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: myUWZCards,
        },
        specialsZone: {
          id: "klsjfd",
          playerId: "l93fld9",
          placeType: "specialsZone",
          cards: mySpecialsZoneCards,
          acceptedCardType: "special",
        },
        hand: {
          id: "pqewoi",
          playerId: "l93fld9",
          placeType: "hand",
          cards: myHandCards,
        },
        enchantmentsRow: {
          id: "324562132300",
          playerId: "l93fld9",
          placeType: "enchantmentsRow",
          cards: myEnchantmentsRowCards,
        },
      },
    },
    {
      id: "enemy",
      name: "string",
      current: false,
      currentPhase: "normalPhase",
      draws: 1,
      plays: 1,
      rolls: 1,
      //points:number,//??????
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: "jr2034jrpdsf",
          playerId: "enemy",
          placeType: "GCZ",
          acceptedCardType:"guest",
          cards: player1GCZCards,
        },
        UWZ: {
          id: "aqu2389uh234rj",
          playerId: "enemy",
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: "09asdufj",
          playerId: "enemy",
          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: "2kopvjops",
          playerId: "enemy",
          placeType: "hand",
          cards: player1HandCards,
        },
        enchantmentsRow: {
          id: "jfw3o90jvskd",
          playerId: "enemy",
          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
    {
      id: "enemy2",
      name: "string2",
      current: false,
      currentPhase: "normalPhase",
      draws: 1,
      plays: 1,
      rolls: 1,
      //points:number,//??????
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: "vvv",
          playerId: "enemy2",
          placeType: "GCZ",
          cards: [],
        },
        UWZ: {
          id: "mmm",
          playerId: "enemy2",
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: "jjjjj",
          playerId: "enemy2",
          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: "qqqqqwww",
          playerId: "enemy2",
          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: "yyyyy",
          playerId: "enemy2",
          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
  ],

  nonPlayerPlaces: {
    deck: {
      id: "klasdf",
      placeType: "deck",
      cards: deckCards,
    },
    discardPile: {
      id: "klasd02mcvdlw",
      placeType: "discardPile",
      cards: discardPileCards,
    },
  },
};

// sorts cards into their correct order based on their index according to the DB
// should probably be called "normaliseSnapshot"
export const convertSnapshot = (gameSnapshot: GameSnapshot) => {
  gameSnapshot.players.forEach(p => Object.values(p.places).forEach(pl => pl.cards.sort((c, d) => c.index - d.index)));
  Object.values(gameSnapshot.nonPlayerPlaces).forEach(pl => pl.cards.sort((c, d) => c.index - d.index));
  return gameSnapshot;
};

export const convertedSnapshot = convertSnapshot(initialGameSnapshot);
