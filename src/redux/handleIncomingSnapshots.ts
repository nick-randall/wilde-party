import addTransitionTemplatesToNewestSnapshot from "../transitionFunctions.ts/addTransitionTemplatesToNewestSnapshot";
import { addNewGameSnapshots } from "./newSnapshotActions";
import { RootState } from "./store";

/**
 * Converts the snapshots to type NewSnapshot
 * sorts them in the correct order
 * 
 * @param newSnapshots new Snapshots from the server
 * @returns 
 */
const handleIncomingSnapshots = (incomingNewSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {
  const incomingSnapshotsWereFirstInStack = getState().newSnapshots.length === 0
  // Convert snapshots to type NewSnapshot, adding transitionTemplates
  let newSnapshotsAsNewSnapshots: NewSnapshot[] = incomingNewSnapshots.map(e => ({...e, transitionTemplates: [] }));
  let sortedNewSnapshots = newSnapshotsAsNewSnapshots.sort((a, b) => a.id - b.id);
  dispatch(addNewGameSnapshots(sortedNewSnapshots));
  if(incomingSnapshotsWereFirstInStack) {
    // Create transitionTemplates from the newestSnapshot
    dispatch(addTransitionTemplatesToNewestSnapshot())
  }
  
};

export default handleIncomingSnapshots;


// const handleIncomingSnapshots = (newSnapshots: GameSnapshot[]) => (dispatch: Function, getState: () => RootState) => {
  
//   const { gameSnapshot } = getState();
//   let newSnapshotsAsNewSnapshots: NewSnapshot[] = newSnapshots.map(e => ({...e, transitionTemplates: [] }));
//   let snapshotsNewerThanCurrSnapshot = newSnapshotsAsNewSnapshots.filter(newSnap => newSnap.id > gameSnapshot.id);
//   let sortedNewSnapshots = snapshotsNewerThanCurrSnapshot.sort((a, b) => a.id - b.id);
//   const firstNewSnapshot = sortedNewSnapshots.shift();
//   // NewSnapshotCreator
//   if (firstNewSnapshot) {
//     const changes = findChanges({ prevSnapshot: gameSnapshot, newSnapshot: firstNewSnapshot });
//     const transitionTemplates = createTransitionTemplates(changes, firstNewSnapshot.snapshotUpdateType);
//     const newSnapshotComplete = { ...firstNewSnapshot, transitionTemplates, snapshotUpdateType: "addDragged" } as NewSnapshot;
//     //
//     const newSnapshotsWithCompleteNewSnapshot = [newSnapshotComplete, ...sortedNewSnapshots];
//     // dispatch(createTransitionsFromTemplates)
//     dispatch(addNewGameSnapshots(newSnapshotsWithCompleteNewSnapshot));
//   }
// };

// export default handleIncomingSnapshots;
