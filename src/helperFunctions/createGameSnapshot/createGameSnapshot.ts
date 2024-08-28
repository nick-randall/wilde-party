import { v4 as uuidv4 } from "uuid";
import { getPreppedDeck } from "./createDeck";
import createStartingGuests from "./createStartingGuests";
import { get } from "http";

const numPlayers = 3;

let currIndex = 0;
let currPlayerIndex = 0;
let currPlaceIndex = 0;
const getCurrCardIndex = (idx: number) => idx++;
const getCurrPlayerIndex = () => currPlayerIndex++;
const getCurrPlaceIndex = () => currPlaceIndex++;


export const createGameSnapshot = () => {
  const players: GamePlayer[] = [];
  let { deck: deckCards, deckId } = getPreppedDeck();
  const startingGuests = createStartingGuests(numPlayers, currIndex);
  deckCards.unshift(...startingGuests);

  for (let i = 0; i < numPlayers; i++) {
    const playerId = 1000 + i;
    const player: GamePlayer = {
      id: playerId,
      name: `Player ${i + 1}`,
      glitzaglitza: false,
      skipNextTurn: false,
      places: {
        GCZ: {
          id: getCurrPlaceIndex(),
          playerId: playerId,
          placeType: "GCZ",
          acceptedCardType: "guest",
          cards: [],
        },
        UWZ: {
          id: getCurrPlaceIndex(),
          playerId: playerId,
          placeType: "UWZ",
          acceptedCardType: "unwanted",
          cards: [],
        },
        specialsZone: {
          id: getCurrPlaceIndex(),
          playerId: playerId,
          placeType: "specialsZone",
          acceptedCardType: "special",
          cards: [],
        },
        hand: {
          id: getCurrPlaceIndex(),
          playerId: playerId,
          placeType: "hand",
          cards: [],
        },
        enchantmentsRow: {
          id: getCurrPlaceIndex(),
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
      phase: "dealPhase",
      draws: 1,
      plays: 1,
      rolls: 1,
    },
    players: players,
    nonPlayerPlaces: {
      discardPile: { id: getCurrPlaceIndex(), placeType: "discardPile", cards: [] },
      deck: {
        id: getCurrPlaceIndex(),
        placeType: "deck",
        cards: deckCards,
      },
    },
    snapshotUpdateData: { type: "initialSnapshot", playedCardIds: [], targetId: -1 },

  };
  console.log(JSON.stringify(gameSnapshot));
  return gameSnapshot;
};
