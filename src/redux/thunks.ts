import { buildTransition } from "../dimensions/buildTransition";
import { addTransition, enactDrawCardEvent } from "./actionCreators";

export const drawCard = (player: number) => (dispatch: Function, getState: Function) => {
  const state = getState();
  const { gameSnapshot } = state;
  dispatch(enactDrawCardEvent(player))
  const deckId = gameSnapshot.nonPlayerPlaces["deck"].id;
  const originIndex = 0;
  const handId = gameSnapshot.players[player].places.hand.id;
  const cardId = gameSnapshot.nonPlayerPlaces["deck"].cards[0].id;
  const handIndex = 0;
  const transitionType = "drawCard";
  const newTransition = buildTransition(cardId, transitionType, deckId, originIndex, handId, handIndex, state);
  dispatch(addTransition(newTransition));
};