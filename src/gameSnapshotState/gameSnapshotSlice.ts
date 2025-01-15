import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyGameSnapshot } from "../initialCards";


export type GameState = {
  snapshotIndex: number;
  newSnapshotIndex: number;
  error: string;
  activePlayers: User[];
  currSnapshot: GameSnapshot;
  newSnapshot?: GameSnapshot; 
  snapshots: GameSnapshot[];
};

const initialState: GameState = {
  snapshotIndex: 0,
  newSnapshotIndex: 0,
  currSnapshot: emptyGameSnapshot,
  snapshots: [],
  error: "",
  activePlayers: [],
};

export const gameSnapshotSlice = createSlice({
  name: "gameSnapshot",
  initialState,
  reducers: {
    setInitialSnapshot: (state, action: PayloadAction<GameSnapshot>) => {
      state.snapshotIndex = 0;
      state.snapshots.push(action.payload);
      state.currSnapshot = state.snapshots[state.snapshotIndex];
    },
    addNewSnapshots: (state, action: PayloadAction<GameSnapshot[]>) => {
      const newSnapshots = action.payload;
      state.snapshots.push(...newSnapshots);
      if(newSnapshots.length > 0 && newSnapshots[0].index === 0) {
        state.currSnapshot = newSnapshots[0];
      }
    },
    setNewSnapshot : (state) => {
      state.newSnapshotIndex = state.snapshotIndex + 1;
      state.newSnapshot = state.snapshots[state.newSnapshotIndex];
    },

    resolveNewSnapshot: (state) => {
      // state.activeAnimation = undefined;
      state.snapshotIndex ++;
      state.currSnapshot = state.snapshots[state.snapshotIndex];
    },
    setNotInGameError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateActivePlayers: (state, action: PayloadAction<User[]>) => {
      state.activePlayers = action.payload;
    },
    testUpdateSnapshot: (state, action: PayloadAction<GameSnapshot>) => {
      console.log("test update snapshot. Curr sn index = " + state.snapshotIndex)
      state.snapshots.push(action.payload)
      state.snapshotIndex ++
    }
  },
});

export const {setInitialSnapshot, addNewSnapshots, setNewSnapshot, resolveNewSnapshot, updateActivePlayers, setNotInGameError, testUpdateSnapshot } = gameSnapshotSlice.actions;

export default gameSnapshotSlice.reducer;
