import { T } from "ramda";
import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface MockRenderProviderProps {
  children: (cards: GameCard[], mockRenderCards: string[], silentMockRenderCards: string[]) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type DerivedMockRenderProviderProps = {
  cards: GameCard[];
  mockRenderCardIds: string[];
  silentMockRenderCardIds: string[];
};

const EmissaryHandler: React.FC<MockRenderProviderProps & DerivedMockRenderProviderProps> = ({
  cards,
  children,
  mockRenderCardIds,
  silentMockRenderCardIds,
}) => {
  return children(cards, mockRenderCardIds, silentMockRenderCardIds);
};

const mapStateToProps = (state: RootState, ownProps: MockRenderProviderProps) => {
  const { gameSnapshot, newSnapshots, animationTemplates } = state;
  const { player, placeType, placeId } = ownProps;

  let cards;
  if (player === null) {
    cards = gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    cards = gameSnapshot.players[player].places[placeType].cards;
  }
  let mockRenderCardIds: string[] = [];
  let silentMockRenderCardIds: string[] = [];

  if (newSnapshots.length > 0 && animationTemplates.length > 0) {
    const templatesWithAnimationToThisPlace = animationTemplates
      .filter(a => a.status !== "waitingInLine")
      .filter(a => ("placeId" in a.to ? a.to.placeId === placeId : false));

    if (templatesWithAnimationToThisPlace.length > 0) {
      console.log("should mock render to place: " + placeType);
    }

    if (templatesWithAnimationToThisPlace.length > 0) {
      if (player === null) {
        cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
      } else {
        cards = newSnapshots[0].players[player].places[placeType].cards;
      }
      mockRenderCardIds = cards
        .map(card => card.id)
        .filter(id =>
          templatesWithAnimationToThisPlace.find(
            a => (a.status === "awaitingEmissaryData" || a.status === "awaitingSimultaneousTemplates") && a.to.cardId === id
          )
        );
    }
  }
  return { cards, mockRenderCardIds, silentMockRenderCardIds };
};
export default connect(mapStateToProps)(EmissaryHandler);
