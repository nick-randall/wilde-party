import store from "../redux/store";

export interface Locator {
  player: number | null;
  place: PlaceType;
}
export interface LocationInfo {
  player: number | null;
  placeType: PlaceType;
  index: number;
}

export const playerPlacesTypes: PlaceType[] = ["guestCardZone", "unwantedsZone", "specialsZone", "hand", "enchantmentsRow"];

export const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

export const getNumCards = (player: number | null, placeType: PlaceType, gameSnapshot: GameSnapshot) => {
  if (player === null) {
    return gameSnapshot.nonPlayerPlaces[placeType].cards.length;
  } else {
    return gameSnapshot.players[player].places[placeType].cards.length;
  }
};

export const locatePlace = (placeId: number, gameSnapshot: GameSnapshot | null = null): {placeType: PlaceType, player: number| null} => {
  if (gameSnapshot === null) gameSnapshot = store.getState().gameSnapshotState.currSnapshot;
  console.log("locating place: " + placeId);
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const placeType = playerPlacesTypes[j];
      const place = players[i]["places"][placeType];
      if (placeId === place.id) return { placeType, player: i };
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const placeType = nonPlayerPlacesTypes[k];
    const place = nonPlayerPlaces[placeType];
    if (placeId === place.id) return {placeType, player: null};
  }
  throw new Error("Place could not be found!");
};

export const getPlace = (placeId: number, gameSnapshot: GameSnapshot | null = null): GamePlace => {
  if (gameSnapshot === null) gameSnapshot = store.getState().gameSnapshotState.currSnapshot;
  console.log("locating place: " + placeId);
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const placeType = playerPlacesTypes[j];
      const place = players[i]["places"][placeType];
      if (placeId === place.id) return  place;
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const placeType = nonPlayerPlacesTypes[k];
    const place = nonPlayerPlaces[placeType];
    if (placeId === place.id) return place;
  }
  throw new Error("Place could not be found!");
};


export const locateCard = (cardId: number, gameSnapshot: GameSnapshot): LocationInfo => {

  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === cardId) return { player: i, placeType: place, index: l }; // player is i, place is place
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === cardId) return { player: null, placeType: place, index: l };
    }
  }
  throw new Error("cardId Not found! -- " + cardId);
  // return { player: null, placeType: "guestCardZone", index: -1 };
};

export const getPlayerPlaceKeys = (gameSnapshot: GameSnapshot, player: GamePlayer) =>
  Object.keys(gameSnapshot.players[gameSnapshot.players.indexOf(player)].places);
export const getNonPlayerPlaceKeys = (gameSnapshot: GameSnapshot) => Object.keys(gameSnapshot.nonPlayerPlaces);

export const locate2 = (id: number, gameSnapshot: GameSnapshot) => {
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

// export const locate2 = (id: number, gameSnapshot: GameSnapshot) => {
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

// export const getIndex = (cardId: number, gameSnapshot: GameSnapshot): number => {
//   const { players, nonPlayerPlaces } = gameSnapshot;
//   for (let i: number = 0; i < players.length; i++) {
//     for (let j: number = 0; j < playerPlacesTypes.length; j++) {
//       const place = playerPlacesTypes[j];
//       for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
//         if (players[i]["places"][place].cards[l].id === cardId) return players[i]["places"][place].cards[l].index;
//       }
//     }
//   }
//   for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
//     const place = nonPlayerPlacesTypes[k];
//     for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
//       if (nonPlayerPlaces[place].cards[l].id === cardId) return nonPlayerPlaces[place].cards[l].index;
//     }
//   }
//   return -1;
// };

export const getImage = (cardId: number, gameSnapshot: GameSnapshot): string => {
  const { players, nonPlayerPlaces } = gameSnapshot;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === cardId) return players[i]["places"][place].cards[l].imageName;
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === cardId) return nonPlayerPlaces[place].cards[l].imageName;
    }
  }
  return "";
};

export const getCard = (cardId: number, gameSnapshot: GameSnapshot): GameCard => {
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
    id: 123123,
    name: "bffs1",
    actionType: "enchantWithBff",
    pointValue: 1,
    imageName: "bffs1.jpg",
    cardType: "bff",
    action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
  };
  return card;
};

export const getPlaceType = (placeId: number, gameSnapshot: GameSnapshot): PlaceType => {
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
  return "guestCardZone";
};
