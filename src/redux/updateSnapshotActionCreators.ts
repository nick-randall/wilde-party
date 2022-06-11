

 type ReplaceCurrentSnapshotWithNewSnapshot = {
  type: "OVERWRITE_CURRENT_SNAPSHOT";
  payload: NewSnapshot;
};

type SetNewSnapshot = {
  type: "SET_NEW_SNAPSHOT";
  payload: NewSnapshot;
};

type RemoveNewSnapshot = {
  type: "REMOVE_NEW_SNAPSHOT";
  payload: number
}

export type UpdateSnapshotTypes = ReplaceCurrentSnapshotWithNewSnapshot | SetNewSnapshot | RemoveNewSnapshot;

/**
 * Replaces the snapshot with a new one (for example)
 * @param newSnapshot 
 * @returns 
 */
export const  setNewSnapshot = (newSnapshot: NewSnapshot): SetNewSnapshot => ({
  type: "SET_NEW_SNAPSHOT",
  payload: newSnapshot,
});

export const removeNewSnapshot = (id: number): RemoveNewSnapshot => ({type: "REMOVE_NEW_SNAPSHOT", payload: id})

export const replaceCurrentSnapshotWithNewSnapshot = (newSnapshot: NewSnapshot): ReplaceCurrentSnapshotWithNewSnapshot => ({type: "OVERWRITE_CURRENT_SNAPSHOT", payload: newSnapshot});