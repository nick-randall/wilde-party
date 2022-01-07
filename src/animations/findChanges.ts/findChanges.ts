import { nonPlayerPlacesTypes, playerPlacesTypes } from "../../helperFunctions/locateFunctions";

interface ToOrFrom {
  card: GameCard;
  place: PlaceType;
  player: number  | null;
  index: number;
}

export interface Change {
  from: ToOrFrom;
  to: ToOrFrom;
}

export const findChanges = ({ prevSnapshot, newSnapshot }: { prevSnapshot: GameSnapshot; newSnapshot: GameSnapshot }) => {
  if (prevSnapshot.players.length === 0) return [];
  const changes = [];
  const players = prevSnapshot.players;

  for (let player = 0; player < players.length; player ++) {
    for (let place of playerPlacesTypes) {
      // run this for each "place array"
      let differences = prevSnapshot.players[player].places[place].cards.filter(card => !newSnapshot.players[player].places[place].cards.includes(card));
      if (differences.length === 0) return;
       else {
        for (let i = 0; i < differences.length; i++) {
          
          let change: Change = { from : {
            card: differences[i],
            place: place,
            player: player,
            index: prevSnapshot.players[player].places[place].cards.indexOf(differences[i]),
          },
          to: {
            card: differences[i],
            place: place,
            player: player,
            index: prevSnapshot.players[player].places[place].cards.indexOf(differences[i]),
          }
        };
          changes.push(change);
        }
      }
    }
  }
  // now check deck & discard pile
  for (let place of nonPlayerPlacesTypes) {
    let differences = prevSnapshot.nonPlayerPlaces[place].cards.filter(card => !newSnapshot.nonPlayerPlaces[place].cards.includes(card));
    if (differences.length === 0) {
    } else {
      for (let i = 0; i < differences.length; i++) {
        let change: Change = { from : {
          card: differences[i],
          place: place,
          player: null,
          index: prevSnapshot.nonPlayerPlaces[place].cards.indexOf(differences[i]),
        },
        to: {
          card: differences[i],
          place: place,
          player: null,
          index: prevSnapshot.nonPlayerPlaces[place].cards.indexOf(differences[i]),        }
      };
        changes.push(change);
      }
    }
  }
  // find those missing cards!!!
  for (let change = 0; change < changes.length; change++) {
    for (let player = 0; player < players.length; player ++) {
      for (let place of playerPlacesTypes) {
        let i = 0;
        while (i < newSnapshot.players[player].places[place].cards.length) {
          if (newSnapshot.players[player].places[place].cards[i] === changes[change]["from"]["card"]) {
            changes[change]["to"] = {
              card: changes[change]["from"]["card"],
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
      while (i < newSnapshot.nonPlayerPlaces[place].cards.length) {
        if (newSnapshot.nonPlayerPlaces[place].cards[i] === changes[change]["from"]["card"]) {
          console.log("gotcha");
          changes[change]["to"] = {
            card: changes[change]["from"]["card"],
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

// probably useless old code
// export const findChanges = (oldState, newSnapshot) => {
//let changes = []
// const oldhandCards = oldState.handCards
// const newHandCards = newSnapshot.handCards
// for (i = 0 ; i < newhandCards.length i ++ )
// const currCardOld = oldHandCards[i].cardId
// const currCardNew = oldHandCards[i].cardId
// if (currCardOld !== currCardNew)
//    changeOld =  {
//        cardId: currCardOld,
//        place : place,
//        player : player
//        }
//  Now find the card's new position with a for loop
//    changeNew = {
//        cardId: currCardOld,
//        place : place,
//        player : player
//        }
//
// changes.push(changedOld, changeNew)

/*export const gameStateNotAvailable = ({snapshot, user}) => {
  if (snapshot.length > 1) console.log("n")

}*/
