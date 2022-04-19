export type AddNewGameSnapshots = { type: "ADD_NEW_GAME_SNAPSHOTS"; payload: NewSnapshot[] };

export type RemoveGameSnapshot = { type: "REMOVE_GAME_SNAPSHOT"; payload: string };

export const addNewGameSnapshots = (newSnapshots: NewSnapshot[]): AddNewGameSnapshots => ({ type: "ADD_NEW_GAME_SNAPSHOTS", payload: newSnapshots });

export const removeGameSnapshot = (id: string): RemoveGameSnapshot => ({ type: "REMOVE_GAME_SNAPSHOT", payload: id });

export type NewSnapshotActions = RemoveGameSnapshot | AddNewGameSnapshots;
