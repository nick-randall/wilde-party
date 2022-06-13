import { T } from "ramda";
import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface MultiEmissaryHandlerProps {
  children: (cards: GameCard[], emissaryCards: string[]) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type ReduxMultiEmissaryHandlerProps = {
  cards: GameCard[];
  emissaryCards: string[];
};

const EmissaryHandler: React.FC<MultiEmissaryHandlerProps & ReduxMultiEmissaryHandlerProps> = ({ cards, children, emissaryCards }) => {
  return children(cards, emissaryCards);
};

const mapStateToProps = (state: RootState, ownProps: MultiEmissaryHandlerProps) => {
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
  let emissaryCards: string[] = [];

  if (newSnapshots.length > 0) {
    newSnapshots[0].transitionTemplates
      .filter(t => t.status !== "waitingInLine")
      // newSnapshots[0].transitionTemplates
      .forEach(template => {
        // if place contains a card transitioning to or from it..

        // in operator returns true if "placeId" attribute in template.to
        const placeId = "placeId" in template.to ? template.to.placeId : undefined;
        if (placeType === "hand") console.log("hand " + newSnapshots[0].transitionTemplates[0].status + placeId);

        if (placeId === ownProps.placeId) {
          switch (template.status) {
            case "awaitingEmissaryData":
              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              emissaryCards = cards.map(handCard => handCard.id);
              break;
            case "awaitingSimultaneousTemplates":
              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              emissaryCards = cards.map(handCard => handCard.id);
              break;
            case "underway":
              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
              break;
            case "complete":
              console.log("status is complete--> listening to newSnapshot");

              if (player === null) {
                cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
              } else {
                cards = newSnapshots[0].players[player].places[placeType].cards;
              }
          }
        }
      });

    if (newSnapshots.length > 0) {
      newSnapshots[0].transitionTemplates
        .filter(t => t.status !== "waitingInLine")
        // newSnapshots[0].transitionTemplates
        .forEach(template => {
          const placeId = "placeId" in template.from ? template.from.placeId : undefined; // will this work???

          if (placeId === ownProps.placeId) {
            console.log("template from");
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
  return { cards, emissaryCards };
};
export default connect(mapStateToProps)(EmissaryHandler);
