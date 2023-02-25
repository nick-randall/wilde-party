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

const MockRenderProviderWithRearrange: React.FC<MockRenderProviderWithRearrangeProps> = ({ children, player, placeType, placeId }) => {
  const { gameSnapshot, newSnapshots, animationTemplates } = useSelector((state: RootState) => state);

  let cards;
  if (player === null) {
    cards = gameSnapshot.nonPlayerPlaces[placeType].cards;
  } else {
    cards = gameSnapshot.players[player].places[placeType].cards;
  }
  let mockRenderFromIds: string[] = [];
  let mockRenderToIds: string[] = [];
  let prevSnapshotCards: GameCard[] = []

  if (newSnapshots.length > 0 && animationTemplates.length > 0) {
    const templatesWithAnimationToThisPlace = animationTemplates[0]
      .filter(a => a.status !== "waitingInLine" && a.status !== "awaitingSimultaneousTemplates")
      .filter(a => "placeId" in a.to && a.to.placeId === placeId);

    if (templatesWithAnimationToThisPlace.length > 0) {
      if (player === null) {
        cards = newSnapshots[0].nonPlayerPlaces[placeType].cards;
      } else {
        cards = newSnapshots[0].players[player].places[placeType].cards;
      }

      mockRenderToIds = cards
        .map(card => card.id)
        .filter(id => templatesWithAnimationToThisPlace.find(a => a.cardId === id && a.status === "awaitingEmissaryData"));
    }

    const templatesWithAnimationFromThisPlace = animationTemplates[0]
      .filter(a => a.status === "awaitingEmissaryData")
      .filter(a => "placeId" in a.from && a.from.placeId === placeId);
    if (templatesWithAnimationFromThisPlace.length > 0) {
      if (player === null) {
        prevSnapshotCards = gameSnapshot.nonPlayerPlaces[placeType].cards;
      } else {
        prevSnapshotCards = gameSnapshot.players[player].places[placeType].cards;
      }
      mockRenderFromIds = prevSnapshotCards
      .map(card => card.id)
      .filter(id => templatesWithAnimationFromThisPlace.find(a => a.cardId === id && a.status === "awaitingEmissaryData"));
    }
   
  }
  return children({ prevSnapshotCards, cards, mockRenderFromIds, mockRenderToIds });
};
export default MockRenderProviderWithRearrange;
