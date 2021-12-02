// Sort Queries by index so the array structure reflects the
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
];

export const myHandCards: GameCard[] = [
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
     action: { actionType: "enchantWithBff", highlightType: "guestCard", cardHighlightType: "guest" },
  },
  {
    id: "jadsif293jfnjskdnv",
    name: "schleckermaul4",
    playerId: "l93fld9",
    placeId: "pqewoi",
    index: 0,
    image: "schleckermaul4",
    cardType: "guest",
    pointValue: 1,
    bffs: false,
    zwilling: false,
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  },
  {
    id: "123123",
    name: "barkeeper",
    placeId: "pqewoi",
    playerId: "l93fld9",
    index: 1,
    pointValue: 1,
    bffs: false,
    zwilling: false,
    image: "barkeeper",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone" },
  },
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
    action: { actionType: "enchant", highlightType: "guestCard", cardHighlightType: "guest" },
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
export const myEnchantmentsRowCards: GameCard[] = [
  // {
  //   id: "asdf2r42345",
  //   name: "zwilling2",
  //   placeId: "324562132300",
  //   playerId: "l93fld9",
  //   index: 1,
  //   pointValue: 1,
  //   bffs: false,
  //   zwilling: false,
  //   image: "zwilling",
  //   cardType: "zwilling",
  //   action: { actionType: "enchant", highlightType: "guestCard", cardHighlightType: "guest" },
  // },
  
  
];

const mySpecialsZoneCards: GameCard[] = [
  {
    id: "9d2304jf",
    name: "partypizza",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 0,
    pointValue: 0,
    bffs: false,
    zwilling: false,
    image: "partypizza",
    cardType: "special",
    specialsCardType: "schleckermaul",
    action: { actionType: "addDragged", highlightType: "guestCard", cardHighlightType: "guest" },
  },
  {
    id: "mnbvyxcv",
    name: "nebelmaschine",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 1,
    pointValue: 0,
    bffs: false,
    zwilling: false,
    image: "nebelmaschine",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "guestCard", cardHighlightType: "guest" },
  },
  {
    id: "pppppppf1",
    name: "playlist",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 2,
    pointValue: 0,
    bffs: false,
    zwilling: false,
    image: "playlist",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "guestCard", cardHighlightType: "guest" },
  },
  {
    id: "pppppppf1",
    name: "megaphon",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 3,
    pointValue: 0,
    bffs: false,
    zwilling: false,
    image: "megaphon",
    cardType: "special",
    specialsCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "guestCard", cardHighlightType: "guest" },
  },
  {
    id: "pppppppf1",
    name: "prost",
    placeId: "klsjfd",
    playerId: "l93fld9",
    index: 4,
    pointValue: 0,
    bffs: false,
    zwilling: false,
    image: "prost",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "guestCard", cardHighlightType: "guest" },
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
        placeType: "GCZ",
        cards: [],
      },
      specialsZone: {
        id: "klsjfd",
        playerId: "l93fld9",
        placeType: "specialsZone",
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
    currentPhase: "normalActionPhase",
    draws: 1,
    plays: 1,
    rolls: 1,
    //points:number;//??????
    glitzaglitza: false,
    skipNextTurn: false,
  },
];

export const initialGameSnapshot: GameSnapshot = {
  players: [
    {
      id: "l93fld9",
      name: "Nick",
      current: true,
      currentPhase: "normalDrawPhase",
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
          placeType: "GCZ",
          cards: [],
        },
        specialsZone: {
          id: "klsjfd",
          playerId: "l93fld9",
          placeType: "specialsZone",
          cards: mySpecialsZoneCards,
        },
        hand: {
          id: "pqewoi",
          playerId: "l93fld9",
          placeType: "GCZ",
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
      currentPhase: "normalDrawPhase",
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
          cards: [],
        },
        UWZ: {
          id: "aqu2389uh234rj",
          playerId: "enemy",
          placeType: "UWZ",
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
          cards: [],
        },
        enchantmentsRow: {
          id: "jfw3o90jvskd",
          playerId: "enemy",
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
      cards: [],
    },
    discardPile: {
      id: "klasd02mcvdlw",
      placeType: "discardPile",
      cards: [],
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

export const convertedSnapshot = convertSnapshot(initialGameSnapshot)
