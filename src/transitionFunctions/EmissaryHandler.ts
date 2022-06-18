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
  const { player, placeType } = ownProps;
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
    newSnapshots[0].animationTemplates
      .filter(t => t.status !== "waitingInLine")
      // newSnapshots[0].transitionTemplates
      .forEach(template => {
        // if place contains a card transitioning to or from it..

        const placeId = "placeId" in template.to ? template.to.placeId : undefined // will this work???

        if (placeId === ownProps.placeId) {
          switch (template.status) {
            case "awaitingEmissaryData":
              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              emissaryCardIndex = cards.map(handCard => handCard.id).indexOf(template.to.cardId);
              break;
            case "underway":

              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              break;
            case "complete":

              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
          }
        }
      });

    if (newSnapshots.length > 0) {
      newSnapshots[0].animationTemplates
        .filter(t => t.status !== "waitingInLine")
        // newSnapshots[0].transitionTemplates
        .forEach(template => {
          const placeId = "placeId" in template.from ? template.from.placeId : undefined // will this work???

          if (placeId === ownProps.placeId) {
            switch (template.status) {
              case "underway":
                if (player === null) {
                  cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
                } else {
                  cards = newSnapshots[0].players[player].places[placeType].cards;
                }
                break;
              //     case "complete":
              //       console.log("status is complete--> listening to newSnapshot");

              //       if (player === null) {
              //         cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              //       } else {
              //         cards = newSnapshots[0].players[player].places[placeType].cards;
              //       }
            }
          }
        });
    }
  }
  return { cards, emissaryCardIndex };
};
export default connect(mapStateToProps)(EmissaryHandler);
