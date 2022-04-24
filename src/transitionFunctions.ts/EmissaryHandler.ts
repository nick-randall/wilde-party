import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface EmissaryHandlerProps {
  children: (cards: GameCard[]) => JSX.Element;
  player: number;
  placeType: PlaceType;
  placeId: string;
}

type ReduxEmissaryHandlerProps = {
  cards: GameCard[];
  emissaryIndex: number;
};

const EmissaryHandler: React.FC<EmissaryHandlerProps & ReduxEmissaryHandlerProps> = ({ cards, children }) => {
  return children(cards);
};

const mapStateToProps = (state: RootState, ownProps: EmissaryHandlerProps) => {
  const { gameSnapshot, newSnapshots } = state;
  const { placeId, player, placeType } = ownProps;
  // this path should be figured out with
  // player slash place data;
  let cards;
  if (player === null) {
    cards = gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    cards = gameSnapshot.players[player].places[placeType].cards;
  }
  let emissaryCardIndex;

  if (newSnapshots.length > 0) {
    newSnapshots[0].transitionTemplates.forEach(template => {
      // if place contains a card transitioning to or from it..
      if (template.to.placeId === placeId) {
        //TODO sort somtehing like this:
        // if (template.to.placeId === id || template.from.placeId === id) {
        switch (template.status) {
          case "waitingInLine":
            break;

          case "awaitingEmissaryData":
            if (player === null) {
              cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
            } else {
              cards = newSnapshots[0].players[player].places[placeType].cards;
            }
            console.log("listening to newSnapshot");
            emissaryCardIndex = cards.map(handCard => handCard.id).indexOf(template.to.cardId);
            console.log("listening to newSnapshot and awaitingEmissary at index " + emissaryCardIndex);
            break;
          case "underway":
            console.log("listening to newSnapshot");
            cards = newSnapshots[0].players[player].places[placeType].cards;
          // case "complete" :
          //   break; ???
        }
      }
    });
  }
  return { cards, emissaryCardIndex };
};
export default connect(mapStateToProps)(EmissaryHandler);
