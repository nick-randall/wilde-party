import { buildTransition } from "../../dimensions/buildTransition";
import { getSettings } from "../../gameSettings/uiSettings";
import store, { RootState } from "../../redux/store";
import { findSnapshotDifferences } from "./findSnapshotDifferences";

// based on expecting a single change.

export const buildTransitionFromChanges = ({prevSnapshot, newSnapshot} : {prevSnapshot: GameSnapshot, newSnapshot: GameSnapshot}, transitionType: string, delay: number, state: RootState | null = null) => {
  const settings = getSettings();
  if(state === null) state = store.getState()
  const changes = findSnapshotDifferences({prevSnapshot, newSnapshot});
  if(settings.logVerbose)console.log(changes[0]);
  const {from, to} = changes[0];
  const transition = buildTransition(from.cardId, transitionType, delay, from.placeId, from.index, to.placeId, to.index, state)
  return transition;
}