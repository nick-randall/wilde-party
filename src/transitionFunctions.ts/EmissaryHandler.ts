import { T } from "ramda";
import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface EmissaryHandlerProps {
  children: (cards: GameCard[], emissaryCardIndex: number | undefined) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type ReduxEmissaryHandlerProps = {
  cards: GameCard[];
  emissaryCardIndex: number | undefined;
};

const EmissaryHandler: React.FC<EmissaryHandlerProps & ReduxEmissaryHandlerProps> = ({ cards, children, emissaryCardIndex }) => {
  return children(cards, emissaryCardIndex);
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
    newSnapshots[0].transitionTemplates
      .filter(t => t.status !== "waitingInLine")
      // newSnapshots[0].transitionTemplates
      .forEach(template => {
        // if place contains a card transitioning to or from it..
        if (template.to.placeId === placeId) {
          switch (template.status) {
            case "awaitingEmissaryData":
              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              console.log("status is awaitingEmissaryData--> listening to newSnapshot...with ID " + newSnapshots[0].id );
              emissaryCardIndex = cards.map(handCard => handCard.id).indexOf(template.to.cardId);
              break;
            case "underway":
              console.log("status is underway--> listening to newSnapshot");

              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              break;
            // case "complete":
            //   console.log("status is complete--> listening to newSnapshot");

            //   if (player === null) {
            //     cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
            //   } else {
            //     cards = newSnapshots[0].players[player].places[placeType].cards;
            //   }
          }
          if (template.from.placeId === placeId) {
            switch (template.status) {
              case "awaitingEmissaryData":
                console.log("TEMPLATEFROM: status is awaitingEmissaryData--> listening to newSnapshot");

                if (player === null) {
                  cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
                } else {
                  cards = newSnapshots[0].players[player].places[placeType].cards;
                }
                break;}}
          //     case "underway":
          //       console.log("TEMPLATEFROM: status is underway--> listening to newSnapshot");

          //       if (player === null) {
          //         cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
          //       } else {
          //         cards = newSnapshots[0].players[player].places[placeType].cards;
          //       }
          //       break;
          //   }
          // }
        }
      });
  }
  return { cards, emissaryCardIndex };
};
export default connect(mapStateToProps)(EmissaryHandler);
