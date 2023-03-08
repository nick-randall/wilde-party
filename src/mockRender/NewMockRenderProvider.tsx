import React from "react";
import { connect, useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface MockRenderProvidedProps {
  prevSnapshotCards: GameCard[];
  cards: GameCard[];
  mockRenderFromIds: string[];
  mockRenderToIds: string[];
}

interface MockRenderProviderWithRearrangeProps {
  children: (mockRenderProvidedProps: MockRenderProvidedProps) => JSX.Element;
  player: number | null;
  placeType: PlaceType;
  placeId: string;
}

const getPrevSnapshotCards = (data: MockRenderProviderWithRearrangeProps, gameSnapshot: GameSnapshot) => {
  const { player, placeType } = data;
  if (player === null) {
    return gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    return gameSnapshot.players[player].places[placeType].cards;
  }
};

const getNewSnapshotCards = (data: MockRenderProviderWithRearrangeProps, newSnapshots: GameSnapshot[]) => {
  const { player, placeType } = data;
  if (player === null) {
    return newSnapshots[0].nonPlayerPlaces[placeType].cards;
  } else {
    return newSnapshots[0].players[player].places[placeType].cards;
  }
};

const renderCardsWithAnimationAway = (
  data: MockRenderProviderWithRearrangeProps,
  animationTemplates: AnimationTemplate[][],
  gameSnapshot: GameSnapshot,
  newProps: NewMockRenderProviderProps
) => {
  const { player, placeType, placeId } = data;
  const { card, placeholder } = newProps;

  const cardIdsPlaceIsLosing = animationTemplates[0]
    .filter(a => a.status === "underway" || a.status === "complete")
    .filter(a => "placeId" in a.from && a.from.placeId === placeId)
    .map(template => template.cardId);

  const prevCards = getPrevSnapshotCards(data, gameSnapshot);

  const cards = prevCards.map(gameCard => (cardIdsPlaceIsLosing.includes(gameCard.id) ? placeholder : card));

  return cards;
};

const collectFromScreenData = (newProps: NewMockRenderProviderProps, prevCards: GameCard[], mockRenderIds: string[]) => {
  const { card, screenDataFromCard } = newProps;
  // This will be a card specifically made to send screen data
  const cards = prevCards.map(gameCard => (mockRenderIds.includes(gameCard.id) ? screenDataFromCard : card));
};

const collectToScreenData = (newProps: NewMockRenderProviderProps, prevCards: GameCard[], mockRenderIds: string[], placeType: PlaceType) => {
  const { card, mockrenderToCard } = newProps;
  // this could be a TableMockRenderCard or HandMockRenderCard
  // if(placeType === "hand")
  return prevCards.map(gameCard => (mockRenderIds.includes(gameCard.id) ? mockrenderToCard : card));
  // else return prevCards.map(gameCard => (mockRenderIds.includes(gameCard.id) ? mockrenderToCard : card));

};

interface NewMockRenderProviderProps {
  card: JSX.Element;
  placeholder: JSX.Element;
  mockrenderToCard: JSX.Element;
  screenDataFromCard: JSX.Element;
}

const MockRenderProviderWithRearrange: React.FC<MockRenderProviderWithRearrangeProps> = (props: MockRenderProviderWithRearrangeProps) => {
  const { children, player, placeType, placeId } = props;
  const { gameSnapshot, newSnapshots, animationTemplates } = useSelector((state: RootState) => state);

  const toTemplates = animationTemplates[0].filter(a => "placeId" in a.to && a.to.placeId === placeId);
  const fromTemplates = animationTemplates[0].filter(a => "placeId" in a.from && a.from.placeId === placeId);

  let cards;
  if (player === null) {
    cards = gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    cards = gameSnapshot.players[player].places[placeType].cards;
  }
  let mockRenderFromIds: string[] = [];
  let mockRenderToIds: string[] = [];
  let prevSnapshotCards: GameCard[] = [];

  if (newSnapshots.length > 0 && animationTemplates.length > 0) {
    const activeToAnimations = toTemplates.filter(a => a.status === "underway" || a.status === "complete");

    // These templates "from" this place are just for mock render data
    // They only exist while awaitingScreenData templates exist.
    const awaitingToScreenData = toTemplates.filter(a => a.status === "awaitingScreenData");

    const awaitingFromScreenData = fromTemplates.filter(a => a.status === "awaitingScreenData");

    const activeFromAnimations = fromTemplates.filter(a => a.status === "underway" || a.status === "complete");

    if (awaitingFromScreenData.length > 0 && awaitingToScreenData.length > 0) {
      // handle rearrange.
    } else if (awaitingFromScreenData.length > 0) {
      cards = getPrevSnapshotCards(props, gameSnapshot);
      // cards will use useMockRender to send screen data
    } else if (awaitingToScreenData.length > 0) {
      cards = getNewSnapshotCards(props, newSnapshots);
      mockRenderToIds = awaitingToScreenData.map(template => template.cardId);
    } else if (activeFromAnimations.length > 0) {
      cards = getPrevSnapshotCards(props, gameSnapshot);
      // place has lost a card -- add placeholders
    } else if (activeToAnimations.length > 0) {
      cards = getNewSnapshotCards(props, newSnapshots);
    }

    // Adding this fixes the issue of having a double card animated. It
    // tells the place to render the new snapshot state if it has lost a
    // card. It also causes the other problem, though.

    const hasLostACard = true;
    if (player === null) {
      cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
    } else {
      cards = newSnapshots[0].players[player].places[placeType].cards;
    }
    // mockRenderFromIds = prevSnapshotCards
    // .map(card => card.id)
    // .filter(id => templatesWithAnimationFromThisPlace.find(a => a.cardId === id && a.status === "awaitingScreenData"));
  }
  return children({ prevSnapshotCards, cards, mockRenderFromIds, mockRenderToIds });
};
export default MockRenderProviderWithRearrange;
