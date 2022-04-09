type UpdateSnapshot = {
  type: "UPDATE_SNAPSHOT";
  payload: GameSnapshot;
};

type SetNewSnapshot = {
  type: "SET_NEW_SNAPSHOT";
  payload: { newSnapshot: GameSnapshot; changes: SnapshotChange[] };
};

type UpdateSnapshotTypes = UpdateSnapshot;
