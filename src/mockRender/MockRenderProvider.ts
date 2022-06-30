import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface MockRenderProviderProps {
  children: (cards: GameCard[], mockRenderIds: string[]) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type DerivedMockRenderProviderProps = {
  cards: GameCard[];
  mockRenderIds: string[];
};

const EmissaryHandler: React.FC<MockRenderProviderProps & DerivedMockRenderProviderProps> = ({ cards, children, mockRenderIds }) => {
  return children(cards, mockRenderIds);
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
  let mockRenderIds: string[] = [];

  if (newSnapshots.length > 0 && animationTemplates.length > 0) {
    const templatesWithAnimationToThisPlace = animationTemplates
      .filter(a => a.status === "awaitingEmissaryData" || a.status === "awaitingSimultaneousTemplates")
      .filter(a => ("placeId" in a.to ? a.to.placeId === placeId : false));

    if (templatesWithAnimationToThisPlace.length > 0) {
      console.log("should mock render to place: " + placeType);

      if (player === null) {
        cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
      } else {
        cards = newSnapshots[0].players[player].places[placeType].cards;
      }
      mockRenderIds = cards.map(card => card.id).filter(id => templatesWithAnimationToThisPlace.find(a => a.to.cardId === id));
    }
  }
  return { cards, mockRenderIds };
};
export default connect(mapStateToProps)(EmissaryHandler);
