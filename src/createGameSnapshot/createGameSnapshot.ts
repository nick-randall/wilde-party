import { v4 as uuidv4 } from "uuid";
import shuffle from "../helperFunctions/shuffle";
import { getPreppedDeck } from "./createDeck";
import createStartingGuests from "./createStartingGuests";

const numPlayers = 3;

export const createGameSnapshot = () => {
  const players: GamePlayer[] = [];
  let { deck: deckCards, deckId } = getPreppedDeck();
  const startingGuests = createStartingGuests(numPlayers);
  deckCards =  startingGuests.concat(deckCards)
  
  for (let i = 0; i < numPlayers; i++) {
    const playerId = uuidv4();
    const GCZId = uuidv4();
    // let startGast = shuffledStartGaeste[i];
    // const preppedStartGast = prepStartGast(startGast, playerId, GCZId);
    const player: GamePlayer = {
      id: playerId,
      name: `Player ${i + 1}`,
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: GCZId,
          playerId: playerId,
          placeType: "GCZ",
          acceptedCardType: "guest",
          cards: [],
        },
        UWZ: {
          id: uuidv4(),
          playerId: playerId,
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: uuidv4(),
          playerId: playerId,
          placeType: "specialsZone",
          acceptedCardType: "special",
          cards: [],
        },
        hand: {
          id: uuidv4(),
          playerId: playerId,
          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: uuidv4(),
          playerId: playerId,
          placeType: "enchantmentsRow",
          cards: [],
        },
      },
    };
    
    players.push(player);
  }

  


  const gameSnapshot: GameSnapshot = {
    current: {
      player: 0,
      phase: "normalPhase",
      draws: 1,
      plays: 1,
      rolls: 1,
    },
    players: players,
    nonPlayerPlaces: {
      discardPile: { id: uuidv4(), placeType: "discardPile", cards: [] },
      deck: {
        id: deckId,
        placeType: "deck",
        cards: deckCards,
      },
    },
  };

  return gameSnapshot;
};
