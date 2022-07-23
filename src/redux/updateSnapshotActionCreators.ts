
type ReplaceCurrentSnapshotWithNewSnapshot = {
  type: "OVERWRITE_CURRENT_SNAPSHOT";
  payload: GameSnapshot;
};

type SetNewSnapshots = {
  type: "SET_NEW_SNAPSHOTS";
  payload: GameSnapshot[];
}

type RemoveNewSnapshot = {
  type: "REMOVE_NEW_SNAPSHOT";
  payload: number
}

/**
 * Replaces the snapshot with a new one (for example)
 * @param newSnapshot 
 * @returns 
 */

export const  setNewSnapshots = (newSnapshots: GameSnapshot[]): SetNewSnapshots => ({
  type: "SET_NEW_SNAPSHOTS",
  payload: newSnapshots,
});

export const removeNewSnapshot = (id: number): RemoveNewSnapshot => ({type: "REMOVE_NEW_SNAPSHOT", payload: id})


export const replaceCurrentSnapshotWithNewSnapshot = (newSnapshot: GameSnapshot): ReplaceCurrentSnapshotWithNewSnapshot => ({type: "OVERWRITE_CURRENT_SNAPSHOT", payload: newSnapshot});