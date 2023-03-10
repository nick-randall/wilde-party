import React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/store";
import { CardElementDisplayType, UiGameCard } from "../types/uiTypes";

interface NewMockRenderProviderProps {
  children: (cards: UiGameCard[]) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

type DerivedNewMockRenderProviderProps = {
  cards: UiGameCard[];
};

const getPrevSnapshotCards = (data: NewMockRenderProviderProps, gameSnapshot: GameSnapshot): UiGameCard[] => {
  const { player, placeType } = data;
  let cards: GameCard[];
  if (player === null) {
    cards = gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    cards = gameSnapshot.players[player].places[placeType].cards;
  }
  return cards.map(card => ({ ...card, cardElementDisplayType: "card" }));
};

const getNewSnapshotCards = (data: NewMockRenderProviderProps, newSnapshots: GameSnapshot[]): UiGameCard[] => {
  const { player, placeType } = data;
  let cards: GameCard[];
  if (player === null) {
    cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
  } else {
    cards = newSnapshots[0].players[player].places[placeType].cards;
  }
  return cards.map(card => ({ ...card, cardElementDisplayType: "card" }));
};

const NewMockRenderProvider: React.FC<NewMockRenderProviderProps & DerivedNewMockRenderProviderProps> = ({ cards, children }) => {
  return children(cards);
};

const mapStateToProps = (state: RootState, ownProps: NewMockRenderProviderProps) => {
  const { gameSnapshot, newSnapshots, animationTemplates } = state;
  const { placeId } = ownProps;

  let cards = getPrevSnapshotCards(ownProps, gameSnapshot);

  if (newSnapshots.length > 0 && animationTemplates.length > 0) {
    const toTemplates = animationTemplates[0].filter(a => "placeId" in a.to && a.to.placeId === placeId);
    const fromTemplates = animationTemplates[0].filter(a => "placeId" in a.from && a.from.placeId === placeId);

    const awaitingToScreenData = toTemplates.filter(a => a.status === "awaitingScreenData");
    const activeToAnimations = toTemplates.filter(a => a.status === "underway" || a.status === "complete");
    const awaitingFromScreenData = fromTemplates.filter(a => a.status === "awaitingScreenData");
    const activeFromAnimations = fromTemplates.filter(a => a.status === "underway" || a.status === "complete");

    if (awaitingFromScreenData.length > 0 && awaitingToScreenData.length > 0) {
      // handle rearrange.
    } else if (awaitingFromScreenData.length > 0) {
      // cards will use useMockRender to send screen data
      const prevCards = getPrevSnapshotCards(ownProps, gameSnapshot);
      cards = prevCards.map(card => ({ ...card, cardElementDisplayType: "mockToRender" }));
    } else if (awaitingToScreenData.length > 0) {
      cards = getNewSnapshotCards(ownProps, newSnapshots);
    } else if (activeFromAnimations.length > 0) {
      // place has lost a card -- add placeholders
      const prevCards = getPrevSnapshotCards(ownProps, gameSnapshot);
      const newCardIDs = getNewSnapshotCards(ownProps, newSnapshots).map(card => card.id);
      cards = prevCards.map(card => (newCardIDs.includes(card.id) ? card : { ...card, cardElementDisplayType: "placeholder" }));
    } else if (activeToAnimations.length > 0) {
      cards = getNewSnapshotCards(ownProps, newSnapshots);
    }
  }
  return { cards };
};
export default connect(mapStateToProps)(NewMockRenderProvider);
