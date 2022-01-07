import store from "../../redux/store";

// Returns the player index given a placeId or playerId

const playerPlacesTypes: PlaceType[] = ["GCZ", "UWZ", "specialsZone", "hand", "enchantmentsRow"];
const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

export const locatePlayer = (id: string, gameSnapshot: GameSnapshot | null = null): number | null => {
  //if (id === null) return null;
  if (gameSnapshot === null) gameSnapshot = store.getState().gameSnapshot;

  const { players, nonPlayerPlaces } = gameSnapshot;
  let playerId = gameSnapshot.players.map(p => p.id).indexOf(id);
  if (playerId !== -1) return playerId;
  for (let i: number = 0; i < players.length; i++) {
    for (let j: number = 0; j < playerPlacesTypes.length; j++) {
      const place = playerPlacesTypes[j];
      if (id === players[i]["places"][place].id) return i;
      for (let l = 0; l < players[i]["places"][place].cards.length; l++) {
        if (players[i]["places"][place].cards[l].id === id) return i; // player is i, place is place
      }
    }
  }
  for (let k: number = 0; k < nonPlayerPlacesTypes.length; k++) {
    const place = nonPlayerPlacesTypes[k];
    for (let l = 0; l < nonPlayerPlaces[place].cards.length; l++) {
      if (nonPlayerPlaces[place].cards[l].id === id) return null;
    }
    if (id === nonPlayerPlaces[place].id) return null;
  }
  console.log("id from locatePlayer not found " + id);
  return null;
};

export default locatePlayer;
