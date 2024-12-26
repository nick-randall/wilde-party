// Sort Queries by index so the array structure reflects the
const myGCZCards: GameCard[] = [
  {
    id: 3000,
    name: "saufnase1",

    imageName: "saufnase0",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },

  {
    id: 3000,
    name: "saufnase6",

    imageName: "saufnase2",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
];

export const myHandCards: GameCard[] = [
  {
    id: 3000,
    name: "bffs5",

    pointValue: 1,
    imageName: "bffs",
    cardType: "bff",
    action: { actionType: "enchantWithBff", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "musikfuersichalleinebeansprucherin",

    pointValue: 0,
    imageName: "musikfuersichalleinebeansprucherin",
    cardType: "unwanted",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "unwantedsZone", targetPlayerType: "enemy" },
  },
  // {
  //   id: 3000,
  //   name: "partypizza",
  //   placeId: 3000,
  //   playerId: 3000,
  //   index: 1,
  //   pointValue: 0,
  //   imageName: "partypizza",
  //   cardType: "special",
  //   specialsCardType: "schleckermaul",
  //   action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  // },

  {
    id: 3000,
    name: "zwilling2",

    pointValue: 1,
    imageName: "zwilling",
    cardType: "zwilling",
    action: { targetPlayerType: "self", actionType: "enchant", highlightType: "card", cardHighlightType: "guest" },
  },

  {
    id: 3000,
    name: "barkeeperin",

    pointValue: 1,
    imageName: "barkeeperin",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "zwilling2",

    pointValue: 1,
    imageName: "zwilling",
    cardType: "zwilling",
    action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "rumgroelerin2",

    imageName: "rumgroelerin2", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "quasselstrippe1",

    pointValue: 0,
    imageName: "quasselstrippe",
    cardType: "unwanted",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "unwantedsZone", targetPlayerType: "enemy" },
  },
];
export const myEnchantmentsRowCards: GameCard[] = [];

const mySpecialsZoneCards: GameCard[] = [
  {
    id: 3000,
    name: "nebelmaschine",

    pointValue: 0,
    imageName: "nebelmaschine",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "playlist",

    pointValue: 0,
    imageName: "playlist",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },

  {
    id: 3000,
    name: "prost",

    pointValue: 0,
    imageName: "prost",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
];

const myUWZCards: GameCard[] = [];

const player1HandCards: GameCard[] = [
  {
    id: 3000,
    name: "rumgroelerin0",

    imageName: "rumgroelerin0", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "taenzerin2",

    imageName: "taenzerin2", //TODO change
    cardType: "guest",
    pointValue: 2,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "schleckermaul2",

    imageName: "schleckermaul2", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "schleckermaul",

    imageName: "schleckermaul3", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
];

const player1GCZCards: GameCard[] = [
  {
    id: 3000,
    name: "rumgroelerin4",

    imageName: "rumgroelerin4",
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
];

const deckCards: GameCard[] = [
  {
    id: 3000,
    name: "megaphon",

    pointValue: 0,
    imageName: "megaphon",
    cardType: "special",
    specialsCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "rumgroelerin3",

    imageName: "rumgroelerin3",
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "schleckermaul4",

    imageName: "schleckermaul4",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "guestCardZone", targetPlayerType: "self" },
  },
];
const discardPileCards: GameCard[] = [
  {
    id: 3000,
    name: "discokugel",

    imageName: "discokugel", //TODO change
    cardType: "special",
    pointValue: 0,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
];

export const initialGamePlayers: GamePlayer[] = [
  {
    id: 3000,
    name: "Nick",
    userId: 3,
    places: {
      GCZ: {
        id: 3000,

        placeType: "guestCardZone",
        acceptedCardType: "guest",
        cards: myGCZCards,
      },
      UWZ: {
        id: 3000,

        placeType: "unwantedsZone",
        acceptedCardType: "unwanted",
        cards: myUWZCards,
      },
      specialsZone: {
        id: 3000,

        placeType: "specialsZone",
        acceptedCardType: "special",

        cards: mySpecialsZoneCards,
      },
      hand: {
        id: 3000,

        placeType: "hand",
        cards: myHandCards,
      },
      enchantmentsRow: {
        id: 3000,

        placeType: "enchantmentsRow",
        cards: myEnchantmentsRowCards,
      },
    },
    // current: true,
    // currentPhase: "normalPhase",
    // draws: 1,
    // plays: 1,
    // rolls: 1,
    //points:number;//??????
    glitzaglitza: false,
    skipNextTurn: false,
  },
];

export const initialGameSnapshot: GameSnapshot = {
  index: 0,
  actionResultsMap: {},

  current: {
    player: 0,
    phase: "dealPhase",
    draws: 1,
    plays: 1,
    rolls: 1,
  },
  players: [
    {
      id: 3000,
      userId: 3,
      name: "Nick",
      // current: true,
      // currentPhase: "normalPhase",
      // draws: 1,
      // plays: 1,
      // rolls: 1,
      //points:number,//??????
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: 3000,

          placeType: "guestCardZone",
          acceptedCardType: "guest",
          cards: myGCZCards,
        },
        UWZ: {
          id: 3000,

          placeType: "unwantedsZone",
          acceptedCardType: "unwanted",
          cards: myUWZCards,
        },
        specialsZone: {
          id: 3000,

          placeType: "specialsZone",
          cards: mySpecialsZoneCards,
          acceptedCardType: "special",
        },
        hand: {
          id: 3000,

          placeType: "hand",
          cards: myHandCards,
        },
        enchantmentsRow: {
          id: 3000,

          placeType: "enchantmentsRow",
          cards: myEnchantmentsRowCards,
        },
      },
    },
    {
      id: 3000,
      userId: 3,
      name: "string",
      // current: false,
      // currentPhase: "normalPhase",
      // draws: 1,
      // plays: 1,
      // rolls: 1,
      //points:number,//??????
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: 3000,

          placeType: "guestCardZone",
          acceptedCardType: "guest",
          cards: player1GCZCards,
        },
        UWZ: {
          id: 3000,

          placeType: "unwantedsZone",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: 3000,

          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 3000,

          placeType: "hand",
          cards: player1HandCards,
        },
        enchantmentsRow: {
          id: 3000,

          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
    {
      id: 3000,
      userId: 3,
      name: "string2",
      // current: false,
      // currentPhase: "normalPhase",
      // draws: 1,
      // plays: 1,
      // rolls: 1,
      // //points:number,//??????
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: 3000,

          placeType: "guestCardZone",
          cards: [],
        },
        UWZ: {
          id: 3000,

          placeType: "unwantedsZone",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: 3000,

          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 3000,

          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: 3000,

          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
  ],

  nonPlayerPlaces: {
    deck: {
      id: 3000,
      placeType: "deck",
      cards: deckCards,
    },
    discardPile: {
      id: 3000,
      placeType: "discardPile",
      cards: discardPileCards,
    },
  },
  snapshotUpdateData: { type: "initialSnapshot", playedCardIds: [], targetId: -1 },
};

export const emptyGameSnapshot: GameSnapshot = {
  index: 0,
  actionResultsMap: {},

  current: {
    player: 0,
    phase: "dealPhase",
    draws: 1,
    plays: 1,
    rolls: 1,
  },
  players: [
    {
      id: 1000,
      userId: 1,
      name: "p1",
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        guestCardZone: {
          id: 3000,

          placeType: "guestCardZone",
          acceptedCardType: "guest",
          cards: [],
        },
        unwantedsZone: {
          id: 101,

          placeType: "unwantedsZone",
          cards: [],
        },
        specialsZone: {
          id: 102,

          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 103,

          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: 104,

          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
    {
      id: 2000,
      userId: 2,
      name: "string",
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        guestCardZone: {
          id: 201,

          placeType: "guestCardZone",
          acceptedCardType: "guest",
          cards: [],
        },
        unwantedsZone: {
          id: 202,

          placeType: "unwantedsZone",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: 203,

          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 204,

          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: 205,

          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
    {
      id: 3000,
      userId: 3,
      name: "string2",

      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        guestCardZone: {
          id: 301,

          placeType: "guestCardZone",
          cards: [],
        },
        unwantedsZone: {
          id: 302,

          placeType: "unwantedsZone",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: 303,

          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 304,

          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: 305,

          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
  ],

  nonPlayerPlaces: {
    deck: {
      id: 3000,
      placeType: "deck",
      cards: [],
    },
    discardPile: {
      id: 3000,
      placeType: "discardPile",
      cards: [],
    },
  },
  snapshotUpdateData: {
    type: "emptySnapshot",
    playedCardIds: [],
    targetId: -1,
  },
};

// sorts cards into their correct order based on their index according to the DB
// should probably be called "normaliseSnapshot"
// export const convertSnapshot = (gameSnapshot: GameSnapshot) => {
//   gameSnapshot.players.forEach(p => Object.values(p.places).forEach(pl => pl.cards.sort((c, d) => c.index - d.index)));
//   Object.values(gameSnapshot.nonPlayerPlaces).forEach(pl => pl.cards.sort((c, d) => c.index - d.index));
//   return gameSnapshot;
// };

// export const convertedSnapshot = convertSnapshot(initialGameSnapshot);
