const playerPlacesTypes: PlaceType[] = [
  "GCZ",
  "UWZ",
  "specialsZone",
  "hand",
  "enchantmentsRow",
];

const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

interface IdListObject {
  [name: string]: string;
}

export const getIdListObject = (gameSnapshot: GameSnapshot) => {
  const idListObject: IdListObject = {};
  for (let i = 0; i < gameSnapshot.players.length; i++) {
    for (let j = 0; j < playerPlacesTypes.length; j++){
      const place = playerPlacesTypes[j];
      const name = 'pl' + i + place;
      idListObject[name] = gameSnapshot.players[i].places[place].id;
    }
  }
  for (let k = 0; k < nonPlayerPlacesTypes.length; k++){
    const place = nonPlayerPlacesTypes[k];
    idListObject[place] = gameSnapshot.nonPlayerPlaces[place].id
  }
  return idListObject;
};
