import store from "../redux/store";
import { getGCZTotalWidth } from "./groupGCZCards";



export const playerPlacesTypes: PlaceType[] = ["GCZ", "UWZ", "specialsZone", "hand", "enchantmentsRow"];

export const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

// working!
export const getNumCards = (placeId: string, gameSnapshot: GameSnapshot): number => {
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      if (placeId === players[i]["places"][place].id) {
        if (place === "enchantmentsRow") return players[i]["places"]["GCZ"].cards.length;
        if (place === "GCZ") return getGCZTotalWidth(players[i]["places"]["GCZ"].cards)
        return players[i]["places"][place].cards.length;
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    if (placeId === nonPlayerPlaces[place].id) return nonPlayerPlaces[place].cards.length;
  }
  console.log("failed to getNumCards for" + placeId);
  return 0;
};

/**
 * Note on performance: locate is very fast (around 0.005ms)
 * However, it gets called hundreds of times, even when just hovering over hand cards.
 */
export const locate = (id: string, gameSnapshot: GameSnapshot | null = null): SimpleSnapshotLocator => {
  if (gameSnapshot === null) gameSnapshot = store.getState().gameSnapshot;

  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      if (id === players[i]["places"][place].id) return { player: i, place: place };
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === id) return { player: i, place: place }; // player is i, place is place
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === id) return { player: null, place: place };
    }
    if (id === nonPlayerPlaces[place].id) return { player: null, place: place };
  }
  console.log("cardId" + id);
  return { player: null, place: "GCZ" };
};

export const getPlayerPlaceKeys = (gameSnapshot: GameSnapshot, player: GamePlayer) =>
  Object.keys(gameSnapshot.players[gameSnapshot.players.indexOf(player)].places);
export const getNonPlayerPlaceKeys = (gameSnapshot: GameSnapshot) => Object.keys(gameSnapshot.nonPlayerPlaces);

export const locate2 = (id: string, gameSnapshot: GameSnapshot) => {
  const player: GamePlayer | undefined = gameSnapshot.players.find(player =>
    getPlayerPlaceKeys(gameSnapshot, player).map(placeKey => player.places[placeKey].cards.find(card => card.id === id))
  );
  if (player) {
    const place: string | undefined = getPlayerPlaceKeys(gameSnapshot, player).find(placeKey =>
      player.places[placeKey].cards.find(card => card.id === id)
    );
    return { player: gameSnapshot.players.indexOf(player), place: place || "place" };
  } else {
    const place: string | undefined = getNonPlayerPlaceKeys(gameSnapshot).find(placeKey =>
      gameSnapshot.nonPlayerPlaces[placeKey].cards.find(card => card.id)
    );
    if (!place) console.log("place for " + id + " not found");
    return { player: null, place: "place" };
  }
};

// const getPlayerPlaceKeys = (gameSnapshot: GameSnapshot) => Object.keys(gameSnapshot.players.map((player) => player.places));
// const getNonPlayerPlaceKeys = (gameSnapshot: GameSnapshot) => Object.keys(gameSnapshot.nonPlayerPlaces);

// export const locate2 = (id: string, gameSnapshot: GameSnapshot) => {
//   const player: GamePlayer | undefined = gameSnapshot.players.find((player) =>
//     getPlayerPlaceKeys(gameSnapshot).map((placeKey) => player.places[placeKey].cards.find((card) => card.id === id))
//   );
//   if (player) {
//     const place: string | undefined = getPlayerPlaceKeys(gameSnapshot).find((placeKey) =>
//       player.places[placeKey].cards.find((card) => card.id === id)
//     );
//     return { player: gameSnapshot.players.indexOf(player), place: place || "place"};
//   } else {
//     const place: string | undefined = getNonPlayerPlaceKeys(gameSnapshot).find((placeKey) =>
//       gameSnapshot.nonPlayerPlaces[placeKey].cards.find((card) => card.id)
//     );
//     if (!place) console.log("place for " + id + " not found");
//     return { player: null, place: "place" };
//   }
// };

export const getIndex = (cardId: string, gameSnapshot: GameSnapshot): number => {
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === cardId) return players[i]["places"][place].cards[l].index;
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === cardId) return nonPlayerPlaces[place].cards[l].index;
    }
  }
  return -1;
};

export const getImage = (cardId: string, gameSnapshot: GameSnapshot): string => {
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === cardId) return players[i]["places"][place].cards[l].image;
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === cardId) return nonPlayerPlaces[place].cards[l].image;
    }
  }
  return "";
};

export const getCard = (cardId: string, gameSnapshot: GameSnapshot): GameCard => {
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === cardId) return players[i]["places"][place].cards[l];
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === cardId) return nonPlayerPlaces[place].cards[l];
    }
  }
  const card: GameCard = {
    id: "123123",
    name: "bffs1",
    placeId: "324562132300",
    playerId: "l93fld9",
    index: 1,
    pointValue: 1,
    bffs: false,
    zwilling: false,
    image: "bffs1.jpg",
    cardType: "bff",
    action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  };
  return card;
};

export const getPlaceType = (placeId: string, gameSnapshot: GameSnapshot): PlaceType => {
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      if (placeId === players[i]["places"][place].id) return place;
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === placeId) return place; // player is i, place is place
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === placeId) return place;
    }
    if (placeId === nonPlayerPlaces[place].id) return place;
  }
  return "GCZ";
};
