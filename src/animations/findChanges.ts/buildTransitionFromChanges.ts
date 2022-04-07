import { buildTransition } from "../../dimensions/buildTransition";
import store, { RootState } from "../../redux/store";
import { findChanges } from "./findSnapshotChanges"

// based on expecting a single change.

export const buildTransitionFromChanges = ({prevSnapshot, newSnapshot} : {prevSnapshot: GameSnapshot, newSnapshot: GameSnapshot}, transitionType: string, delay: number, state: RootState | null = null) => {
  if(state === null) state = store.getState()
  const changes = findChanges({prevSnapshot, newSnapshot});
  console.log(changes[0]);
  const {from, to} = changes[0];
  const transition = buildTransition(from.cardId, transitionType, delay, from.placeId, from.index, to.placeId, to.index, state)
  return transition;
}