import { v4 as uuidv4 } from "uuid";
import { createDeck, getPreppedDeck } from "./deckGenerator";

const numPlayers = 3;

export const createGame = () => {
  const players: GamePlayer[] = [];
  let { deck: deckCards, deckId } = getPreppedDeck();
  for (let i = 0; i < numPlayers; i++) {
    const playerId = uuidv4();
    const player: GamePlayer = {
      id: playerId,
      name: `player${i + 1}`,
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: uuidv4(),
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
