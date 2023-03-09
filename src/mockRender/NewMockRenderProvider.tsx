import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

interface NewMockRenderProviderProps {
  children: (cards: GameCard[], mockRenderIds: string[]) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type DerivedNewMockRenderProviderProps = {
  cards: GameCard[];
  mockRenderIds: string[];
};

const getPrevSnapshotCards = (data: NewMockRenderProviderProps, gameSnapshot: GameSnapshot) => {
  const { player, placeType } = data;
  if (player === null) {
    return gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    return gameSnapshot.players[player].places[placeType].cards;
  }
};

const getNewSnapshotCards = (data: NewMockRenderProviderProps, newSnapshots: GameSnapshot[]) => {
  const { player, placeType } = data;
  if (player === null) {
    return newSnapshots[0].nonPlayerPlaces[placeType].cards;
  } else {
    return newSnapshots[0].players[player].places[placeType].cards;
  }
};

const NewMockRenderProvider: React.FC<NewMockRenderProviderProps & DerivedNewMockRenderProviderProps> = ({ cards, children, mockRenderIds }) => {
  return children(cards, mockRenderIds);
};

const mapStateToProps = (state: RootState, ownProps: NewMockRenderProviderProps) => {
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
    const toTemplates = animationTemplates[0].filter(a => "placeId" in a.to && a.to.placeId === placeId);
    const fromTemplates = animationTemplates[0].filter(a => "placeId" in a.from && a.from.placeId === placeId);
    const activeToAnimations = toTemplates.filter(a => a.status === "underway" || a.status === "complete");

    const awaitingToScreenData = toTemplates.filter(a => a.status === "awaitingScreenData");

    const awaitingFromScreenData = fromTemplates.filter(a => a.status === "awaitingScreenData");

    const activeFromAnimations = fromTemplates.filter(a => a.status === "underway" || a.status === "complete");

    if (awaitingFromScreenData.length > 0 && awaitingToScreenData.length > 0) {
      // handle rearrange.
    } else if (awaitingFromScreenData.length > 0) {
      cards = getPrevSnapshotCards(ownProps, gameSnapshot);
      // cards will use useMockRender to send screen data
    } else if (awaitingToScreenData.length > 0) {
      cards = getNewSnapshotCards(ownProps, newSnapshots);
      mockRenderIds = awaitingToScreenData.map(template => template.cardId);
    } else if (activeFromAnimations.length > 0) {
      cards = getPrevSnapshotCards(ownProps, gameSnapshot);
      
      // place has lost a card -- add placeholders
    } else if (activeToAnimations.length > 0) {
      cards = getNewSnapshotCards(ownProps, newSnapshots);
    }

  }
  return { cards, mockRenderIds };
};
export default connect(mapStateToProps)(NewMockRenderProvider);
