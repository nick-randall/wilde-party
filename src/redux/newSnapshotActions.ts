
export type AddNewGameSnapshots = { type: "ADD_NEW_GAME_SNAPSHOTS"; payload: GameSnapshot[] };

// export type RemoveGameSnapshot = { type: "REMOVE_GAME_SNAPSHOT"; payload: string };

export type NewSnapshotActions =  AddNewGameSnapshots;

export const addNewGameSnapshots = (newSnapshots: GameSnapshot[]): AddNewGameSnapshots => ({ type: "ADD_NEW_GAME_SNAPSHOTS", payload: newSnapshots });

// export const removeGameSnapshot = (id: string): RemoveGameSnapshot => ({ type: "REMOVE_GAME_SNAPSHOT", payload: id });

