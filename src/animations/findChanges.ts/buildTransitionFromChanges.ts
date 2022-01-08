import { buildTransition } from "../../dimensions/buildTransition";
import store, { RootState } from "../../redux/store";
import { findChanges } from "./findChanges"

// based on expecting a single change.

export const buildTransitionFromChanges = ({prevSnapshot, newSnapshot} : {prevSnapshot: GameSnapshot, newSnapshot: GameSnapshot}, transitionType: string, state: RootState | null = null) => {
  if(state === null) state = store.getState()
  const changes = findChanges({prevSnapshot, newSnapshot});
  console.log(changes[0]);
  const {from, to} = changes[0];
  const transition = buildTransition(from.cardId, transitionType, from.placeId, from.index, to.placeId, to.index, state)
  return transition;
}