import { T } from "ramda";
import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface MultiEmissaryHandlerProps {
  children: (cards: GameCard[], emissaryCards: string[], silentEmissaryCards: string[]) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type ReduxMultiEmissaryHandlerProps = {
  cards: GameCard[];
  emissaryCards: string[];
  silentEmissaryCards: string[];
};

const EmissaryHandler: React.FC<MultiEmissaryHandlerProps & ReduxMultiEmissaryHandlerProps> = ({
  cards,
  children,
  emissaryCards,
  silentEmissaryCards,
}) => {
  return children(cards, emissaryCards, silentEmissaryCards);
};

const mapStateToProps = (state: RootState, ownProps: MultiEmissaryHandlerProps) => {
  const { gameSnapshot, newSnapshots } = state;
  const { player, placeType, placeId } = ownProps;

  let cards;
  if (player === null) {
    cards = gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    cards = gameSnapshot.players[player].places[placeType].cards;
  }
  let emissaryCards: string[] = [];
  let silentEmissaryCards: string[] = [];

  if (newSnapshots.length > 0) {
    const templatesWithAnimationToThisPlace = newSnapshots[0].animationTemplates
      .filter(a => a.status !== "waitingInLine")
      .filter(a => ("placeId" in a.to ? a.to.placeId === placeId : false));
      console.log(templatesWithAnimationToThisPlace.length)
    if (templatesWithAnimationToThisPlace.length > 0) {
      if (player === null) {
        cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
      } else {
        cards = newSnapshots[0].players[player].places[placeType].cards;
      }
      emissaryCards = cards
        .map(card => card.id)
        .filter(id => templatesWithAnimationToThisPlace.find(a => a.status === "awaitingEmissaryData" && a.to.cardId === id));
      silentEmissaryCards = cards
        .map(card => card.id)
        .filter(id => templatesWithAnimationToThisPlace.find(a => a.status === "awaitingSimultaneousTemplates" && a.to.cardId === id));
    }
  }
  return { cards, emissaryCards, silentEmissaryCards };
};
export default connect(mapStateToProps)(EmissaryHandler);

// if (newSnapshots.length > 0) {
//   newSnapshots[0].animationTemplates
//     .filter(a => a.status !== "waitingInLine")
//     // newSnapshots[0].animationTemplates
//     .forEach(template => {
//       const placeId = "placeId" in template.from ? template.from.placeId : undefined; // will this work???

//       if (placeId === ownProps.placeId) {
//         console.log("template from");
//         switch (template.status) {
//           case "underway":
//             if (player === null) {
//               cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
//             } else {
//               cards = newSnapshots[0].players[player].places[placeType].cards;
//             }
//             break;
//           //     case "complete":
//           //       console.log("status is complete--> listening to newSnapshot");

//           //       if (player === null) {
//           //         cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
//           //       } else {
//           //         cards = newSnapshots[0].players[player].places[placeType].cards;
//           //       }
//         }
//       }
//     });
// }
