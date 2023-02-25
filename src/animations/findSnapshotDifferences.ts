import { nonPlayerPlacesTypes, playerPlacesTypes } from "../helperFunctions/locateFunctions/locateFunctions";

/**
 * This function returns all differences between two given snapshots
 *
 * Performance note: this function takes about (0.1ms -0.2 ms) when finding one snapshotDifference.
 * @param param0
 * @returns
 */

export const findSnapshotDifferences = (prevSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
  //if (prevSnapshot.players.length === 0) return [];
  const snapshotDifferences = [];
  const players = prevSnapshot.players;

  for (let player = 0; player < players.length; player++) {
    for (let place of playerPlacesTypes) {
      // run this for each "place array"
      const prevCardIds = prevSnapshot.players[player].places[place].cards.map(card => card.id);
      const newCardIds = newSnapshot.players[player].places[place].cards.map(card => card.id);
      const playerId = prevSnapshot.players[player].id;
      const placeId = prevSnapshot.players[player].places[place].id;

      let differences = prevCardIds.filter(card => !newCardIds.includes(card));
      // If rearranging:
      if (newCardIds.length === prevCardIds.length) {
        differences = prevCardIds.filter((card, index) => newCardIds.indexOf(card) !== index);
      }
      if (differences.length === 0) {
      } else {
        for (let i = 0; i < differences.length; i++) {
          let snapshotDifference: SnapshotDifference = {
            cardId: differences[i],
            from: {
              place: place,
              placeId: placeId,
              player: player,
              playerId: playerId,
              index: prevCardIds.indexOf(differences[i]),
            },
            // "to" gets placeholder values.
            to: {
              place: place,
              placeId: placeId,
              player: player,
              playerId: playerId,
              index: prevCardIds.indexOf(differences[i]),
            },
          };
          snapshotDifferences.push(snapshotDifference);
        }
      }
    }
  }

  // now check deck & discard pile
  for (let place of nonPlayerPlacesTypes) {
    const prevCardIds = prevSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
    const newCardIds = newSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
    let differences = prevCardIds.filter(card => !newCardIds.includes(card));

    const placeId = prevSnapshot.nonPlayerPlaces[place].id;

    if (differences.length === 0) {
    } else {
      for (let i = 0; i < differences.length; i++) {
        let snapshotDifference: SnapshotDifference = {
          cardId: differences[i],
          from: {
            place: place,
            placeId: placeId,
            player: null,
            playerId: null,
            index: prevCardIds.indexOf(differences[i]),
          },
          to: {
            placeId: placeId,
            place: place,
            player: null,
            playerId: null,
            index: prevCardIds.indexOf(differences[i]),
          },
        };

        snapshotDifferences.push(snapshotDifference);
      }
    }
  }
  // find those missing cards!!!
  for (let snapshotDifference = 0; snapshotDifference < snapshotDifferences.length; snapshotDifference++) {
    for (let player = 0; player < players.length; player++) {
      for (let place of playerPlacesTypes) {
        let i = 0;
        const newCardIds = newSnapshot.players[player].places[place].cards.map(card => card.id);
        const playerId = newSnapshot.players[player].id;
        const placeId = newSnapshot.players[player].places[place].id;
        for (i = 0; i < newSnapshot.players[player].places[place].cards.length; i++) {
          if (newCardIds[i] === snapshotDifferences[snapshotDifference]["cardId"]) {
            snapshotDifferences[snapshotDifference]["to"] = {
              place: place,
              placeId: placeId,
              player: player,
              playerId: playerId,
              index: i,
            };
            break;
          }
        }
      }
    }
  }

  // now  check deck & discard pile for those missing cards!!!
  for (let snapshotDifference = 0; snapshotDifference < snapshotDifferences.length; snapshotDifference++) {
    for (let place of nonPlayerPlacesTypes) {
      const newCardIds = newSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
      const placeId = newSnapshot.nonPlayerPlaces[place].id;

      for (let i = 0; i < newSnapshot.nonPlayerPlaces[place].cards.length; i++) {
        if (newCardIds[i] === snapshotDifferences[snapshotDifference]["cardId"]) {
          snapshotDifferences[snapshotDifference]["to"] = {
            place: place,
            placeId: placeId,
            player: null,
            playerId: null,
            index: i,
          };
          break;
        }
      }
    }
  }
  return snapshotDifferences;
};
