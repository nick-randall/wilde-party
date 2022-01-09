import { v4 as uuidv4 } from "uuid";
import { createDeck, getPreppedDeck } from "./deckGenerator";

const numPlayers = 3;

const setHandCardsPlaceId = (cards: GameCard[],  playerId: string) => cards.map((card) => ({...card, playerId: playerId}))

// export const generateGame = () => {
//   const players: GamePlayer[] = [];
//   let { deck, deckId } = getPreppedDeck();
//   for (let i = 0; i < numPlayers; i++) {
//     const handCards = deck.splice(deck.length - 7, deck.length - 1);

export const generateGame = () => {
  const players: GamePlayer[] = [];
  let { deck, deckId } = getPreppedDeck();
  for (let i = 0; i < numPlayers; i++) {
    let handCards = deck.splice(deck.length - 7, deck.length - 1);
    const playerId = uuidv4();
    const preppedHandCards = setHandCardsPlaceId(handCards, playerId)
    
    const player: GamePlayer = {
      id: uuidv4(),
      name: "Nick",
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
          cards: preppedHandCards,
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
