// Sort Queries by index so the array structure reflects the
const myGCZCards: GameCard[] = [
  {
    id: 3000,
    name: "saufnase1",
    playerId: 3000,
    placeId: 3000,
    index: 0,
    image: "saufnase0",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },

  {
    id: 3000,
    name: "saufnase6",
    playerId: 3000,
    placeId: 3000,
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
    id: 3000,
    name: "bffs5",
    placeId: 3000,
    playerId: 3000,
    index: 0,
    pointValue: 1,
    image: "bffs",
    cardType: "bff",
    action: { actionType: "enchantWithBff", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "musikfuersichalleinebeansprucherin",
    placeId: 3000,
    playerId: 3000,
    index: 1,
    pointValue: 0,
    image: "musikfuersichalleinebeansprucherin",
    cardType: "unwanted",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
  },
  // {
  //   id: 3000,
  //   name: "partypizza",
  //   placeId: 3000,
  //   playerId: 3000,
  //   index: 1,
  //   pointValue: 0,
  //   image: "partypizza",
  //   cardType: "special",
  //   specialsCardType: "schleckermaul",
  //   action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  // },

  {
    id: 3000,
    name: "zwilling2",
    placeId: 3000,
    playerId: 3000,
    index: 2,
    pointValue: 1,
    image: "zwilling",
    cardType: "zwilling",
    action: { targetPlayerType: "self", actionType: "enchant", highlightType: "card", cardHighlightType: "guest" },
  },
  
  {
    id: 3000,
    name: "barkeeperin",
    placeId: 3000,
    playerId: 3000,
    index: 3,
    pointValue: 1,
    image: "barkeeperin",
    cardType: "special",
    specialsCardType: "saufnase",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "zwilling2",
    placeId: 3000,
    playerId: 3000,
    index: 4,
    pointValue: 1,
    image: "zwilling",
    cardType: "zwilling",
    action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "rumgroelerin2",
    placeId: 3000,
    playerId: 3000,
    index: 5,
    image: "rumgroelerin2", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "quasselstrippe1",
    placeId: 3000,
    playerId: 3000,
    index: 6,
    pointValue: 0,
    image: "quasselstrippe",
    cardType: "unwanted",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "UWZ", targetPlayerType: "enemy" },
  },
];
export const myEnchantmentsRowCards: GameCard[] = [

];

const mySpecialsZoneCards: GameCard[] = [
  {
    id: 3000,
    name: "nebelmaschine",
    placeId: 3000,
    playerId: 3000,
    index: 1,
    pointValue: 0,
    image: "nebelmaschine",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "playlist",
    placeId: 3000,
    playerId: 3000,
    index: 2,
    pointValue: 0,
    image: "playlist",
    cardType: "special",
    specialsCardType: "taenzerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },

  {
    id: 3000,
    name: "prost",
    placeId: 3000,
    playerId: 3000,
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
    id: 3000,
    name: "rumgroelerin0",
    placeId: 3000,
    playerId: 3000,
    index: 0,
    image: "rumgroelerin0", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "taenzerin2",
    playerId: 3000,
    placeId: 3000,
    index: 1,
    image: "taenzerin2", //TODO change
    cardType: "guest",
    pointValue: 2,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "schleckermaul2",
    playerId: 3000,
    placeId: 3000,
    index: 2,
    image: "schleckermaul2", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "schleckermaul",
    placeId: 3000,
    playerId: 3000,
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
    id: 3000,
    name: "rumgroelerin4",
    placeId: 3000,
    playerId: 3000,
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
    id: 3000,
    name: "megaphon",
    placeId: 3000,
    playerId: 3000,
    index: 0,
    pointValue: 0,
    image: "megaphon",
    cardType: "special",
    specialsCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "rumgroelerin3",
    placeId: 3000,
    playerId: 3000,
    index: 1,
    image: "rumgroelerin3",
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: 3000,
    name: "schleckermaul4",
    playerId: 3000,
    placeId: 3000,
    index: 2,
    image: "schleckermaul4",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
    
  
];
const discardPileCards: GameCard[] = [
  {
    id: 3000,
    name: "discokugel",
    playerId: 0,
    placeId: 3000,
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
    id: 3000,
    name: "Nick",
    places: {
      GCZ: {
        id: 3000,
        playerId: 3000,
        placeType: "GCZ",
        acceptedCardType: "guest",
        cards: myGCZCards,
      },
      UWZ: {
        id: 3000,
        playerId: 3000,
        placeType: "UWZ",
        acceptedCardType: "unwanted",
        cards: myUWZCards,
      },
      specialsZone: {
        id: 3000,
        playerId: 3000,
        placeType: "specialsZone",
        acceptedCardType: "special",

        cards: mySpecialsZoneCards,
      },
      hand: {
        id: 3000,
        playerId: 3000,
        placeType: "hand",
        cards: myHandCards,
      },
      enchantmentsRow: {
        id: 3000,
        playerId: 3000,
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
          playerId: 3000,
          placeType: "GCZ",
          acceptedCardType: "guest",
          cards: myGCZCards,
        },
        UWZ: {
          id: 3000,
          playerId: 3000,
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: myUWZCards,
        },
        specialsZone: {
          id: 3000,
          playerId: 3000,
          placeType: "specialsZone",
          cards: mySpecialsZoneCards,
          acceptedCardType: "special",
        },
        hand: {
          id: 3000,
          playerId: 3000,
          placeType: "hand",
          cards: myHandCards,
        },
        enchantmentsRow: {
          id: 3000,
          playerId: 3000,
          placeType: "enchantmentsRow",
          cards: myEnchantmentsRowCards,
        },
      },
    },
    {
      id: 3000,
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
          playerId: 3000,
          placeType: "GCZ",
          acceptedCardType:"guest",
          cards: player1GCZCards,
        },
        UWZ: {
          id: 3000,
          playerId: 3000,
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: 3000,
          playerId: 3000,
          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 3000,
          playerId: 3000,
          placeType: "hand",
          cards: player1HandCards,
        },
        enchantmentsRow: {
          id: 3000,
          playerId: 3000,
          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    },
    {
      id: 3000,
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
          playerId: 3000,
          placeType: "GCZ",
          cards: [],
        },
        UWZ: {
          id: 3000,
          playerId: 3000,
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: 3000,
          playerId: 3000,
          placeType: "specialsZone",
          cards: [],
        },
        hand: {
          id: 3000,
          playerId: 3000,
          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: 3000,
          playerId: 3000,
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

// sorts cards into their correct order based on their index according to the DB
// should probably be called "normaliseSnapshot"
export const convertSnapshot = (gameSnapshot: GameSnapshot) => {
  gameSnapshot.players.forEach(p => Object.values(p.places).forEach(pl => pl.cards.sort((c, d) => c.index - d.index)));
  Object.values(gameSnapshot.nonPlayerPlaces).forEach(pl => pl.cards.sort((c, d) => c.index - d.index));
  return gameSnapshot;
};

export const convertedSnapshot = convertSnapshot(initialGameSnapshot);
