import { nonPlayerPlacesTypes, playerPlacesTypes } from "../../helperFunctions/locateFunctions";

interface ToOrFrom {
  cardId: string;
  place: PlaceType;
  player: number | null;
  index: number;
}
export interface Change {
  from: ToOrFrom;
  to: ToOrFrom;
}

export const findChanges = ({ prevSnapshot, newSnapshot }: { prevSnapshot: GameSnapshot; newSnapshot: GameSnapshot }) => {
  //if (prevSnapshot.players.length === 0) return [];
  const changes = [];
  const players = prevSnapshot.players;

  for (let player = 0; player < players.length; player++) {
    for (let place of playerPlacesTypes) {
      // run this for each "place array"
      const prevCardIds = prevSnapshot.players[player].places[place].cards.map(card => card.id);
      const newCardIds = newSnapshot.players[player].places[place].cards.map(card => card.id);
     
      let differences = prevCardIds.filter(card => !newCardIds.includes(card));
      if (differences.length === 0) {}
      else {
        for (let i = 0; i < differences.length; i++) {
          let change: Change = {
            from: {
              cardId: differences[i],
              place: place,
              player: player,
              index: prevCardIds.indexOf(differences[i]),
            },
            // to only placeholder currently.
            to: {
              cardId: differences[i],
              place: place,
              player: player,
              index: prevCardIds.indexOf(differences[i]),
            },
          };
          changes.push(change);
        }
      }
    }
  }

  // now check deck & discard pile
  for (let place of nonPlayerPlacesTypes) {
    const prevCardIds = prevSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
    const newCardIds = newSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
    let differences = prevCardIds.filter(card => !newCardIds.includes(card));
    if (differences.length === 0) {
    } else {
      for (let i = 0; i < differences.length; i++) {
        let change: Change = {
          from: {
            cardId: differences[i],
            place: place,
            player: null,
            index: prevCardIds.indexOf(differences[i]),
          },
          to: {
            cardId: differences[i],
            place: place,
            player: null,
            index: prevCardIds.indexOf(differences[i]),
          },
        };
        changes.push(change);
      }
    }
  }
  // find those missing cards!!!
  for (let change = 0; change < changes.length; change++) {
    for (let player = 0; player < players.length; player++) {
      for (let place of playerPlacesTypes) {
        let i = 0;

        while (i < newSnapshot.players[player].places[place].cards.length) {
          const newCardIds = newSnapshot.players[player].places[place].cards.map(card => card.id);

          if (newCardIds[i] === changes[change]["from"]["cardId"]) {
            changes[change]["to"] = {
              cardId: changes[change]["from"]["cardId"],
              place: place,
              player: player,
              index: i,
            };
            i = place.length;
          } else i++;
        }
      }
    }
  }
  // now  check deck & discard pile for those missing cards!!!
  for (let change = 0; change < changes.length; change++) {
    for (let place of nonPlayerPlacesTypes) {
      let i = 0;
      const newCardIds = newSnapshot.nonPlayerPlaces[place].cards.map(card => card.id);
      while (i < newSnapshot.nonPlayerPlaces[place].cards.length) {
        if (newCardIds[i] === changes[change]["from"]["cardId"]) {
          console.log("gotcha");
          changes[change]["to"] = {
            cardId: changes[change]["from"]["cardId"],
            place: place,
            player: null,
            index: i,
          };
          i = newSnapshot.nonPlayerPlaces[place].cards.length;
        } else i++;
      }
    }
  }

  console.log(changes);
  return changes;
};
