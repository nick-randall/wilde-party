import createTransitionTemplates from "../animations/findChanges.ts/createTransitionTemplates";
import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import { addNewGameSnapshots } from "./newSnapshotActions";
import { RootState } from "./store";

const handleIncomingSnapshots = (newSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {
  
  const { gameSnapshot } = getState();
  let newSnapshotsAsNewSnapshots: NewSnapshot[] = newSnapshots.map(e => ({...e, transitionTemplates: [] }));
  let filteredNewSnapshots = newSnapshotsAsNewSnapshots.filter(newSnap => newSnap.id > gameSnapshot.id);
  let sortedNewSnapshots = filteredNewSnapshots.sort((a, b) => a.id - b.id);
  const firstNewSnapshot = sortedNewSnapshots.shift();
  // NewSnapshotCreator
  if (firstNewSnapshot) {
    const changes = findChanges({ prevSnapshot: gameSnapshot, newSnapshot: firstNewSnapshot });
    const transitionTemplates = createTransitionTemplates(changes, "addDragged");
    const newSnapshotComplete = { ...firstNewSnapshot, transitionTemplates, snapshotUpdateType: "addDragged" } as NewSnapshot;
    //
    const newSnapshotsWithCompleteNewSnapshot = [newSnapshotComplete, ...sortedNewSnapshots];
    // dispatch(createTransitionsFromTemplates)
    dispatch(addNewGameSnapshots(newSnapshotsWithCompleteNewSnapshot));
  }
};

export default handleIncomingSnapshots;
