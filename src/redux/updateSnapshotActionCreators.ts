

 type ReplaceCurrentSnapshotWithNewSnapshot = {
  type: "OVERWRITE_CURRENT_SNAPSHOT";
  payload: NewSnapshot;
};

type ReplaceCurrentSnapshotWithNewSnapshotNewVersion = {
  type: "OVERWRITE_CURRENT_SNAPSHOT_NEW_VERSION";
  payload: GameSnapshot;
};

type SetNewSnapshot = {
  type: "SET_NEW_SNAPSHOT";
  payload: NewSnapshot;
};

type SetNewSnapshotsNewVersion = {
  type: "SET_NEW_SNAPSHOTS_NEW_VERSION";
  payload: GameSnapshot[];
}

type RemoveNewSnapshot = {
  type: "REMOVE_NEW_SNAPSHOT";
  payload: number
}

export type UpdateSnapshotTypes = ReplaceCurrentSnapshotWithNewSnapshot | SetNewSnapshot | SetNewSnapshotsNewVersion | RemoveNewSnapshot;

/**
 * Replaces the snapshot with a new one (for example)
 * @param newSnapshot 
 * @returns 
 */
export const  setNewSnapshot = (newSnapshot: NewSnapshot): SetNewSnapshot => ({
  type: "SET_NEW_SNAPSHOT",
  payload: newSnapshot,
});

export const  setNewSnapshotsNewVersion = (newSnapshots: GameSnapshot[]): SetNewSnapshotsNewVersion => ({
  type: "SET_NEW_SNAPSHOTS_NEW_VERSION",
  payload: newSnapshots,
});

export const removeNewSnapshot = (id: number): RemoveNewSnapshot => ({type: "REMOVE_NEW_SNAPSHOT", payload: id})

export const replaceCurrentSnapshotWithNewSnapshot = (newSnapshot: NewSnapshot): ReplaceCurrentSnapshotWithNewSnapshot => ({type: "OVERWRITE_CURRENT_SNAPSHOT", payload: newSnapshot});

export const replaceCurrentSnapshotWithNewSnapshotNewVersion = (newSnapshot: GameSnapshot): ReplaceCurrentSnapshotWithNewSnapshotNewVersion => ({type: "OVERWRITE_CURRENT_SNAPSHOT_NEW_VERSION", payload: newSnapshot});