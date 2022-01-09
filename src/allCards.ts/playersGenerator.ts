import { v4 as uuidv4 } from "uuid";
import { createDeck, getPreppedDeck } from "./deckGenerator";

const numPlayers = 3;

export const generateGame = () => {
  const players: GamePlayer[] = [];
  let { deck, deckId } = getPreppedDeck();
  for (let i = 0; i < numPlayers; i++) {
    const handCards = deck.splice(deck.length - 7, deck.length - 1);
    const player: GamePlayer = {
      id: uuidv4(),
      name: "Nick",
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: uuidv4(),
          playerId: uuidv4(),
          placeType: "GCZ",
          acceptedCardType: "guest",
          cards: [],
        },
        UWZ: {
          id: uuidv4(),
          playerId: uuidv4(),
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: uuidv4(),
          playerId: uuidv4(),
          placeType: "specialsZone",
          acceptedCardType: "special",
          cards: [],
        },
        hand: {
          id: uuidv4(),
          playerId: uuidv4(),
          placeType: "hand",
          cards: handCards,
        },
        enchantmentsRow: {
          id: uuidv4(),
          playerId: uuidv4(),
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
        id: uuidv4(),
        placeType: "deck",
        cards: deck,
      },
    },
  };

  return gameSnapshot;
};
