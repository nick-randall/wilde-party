import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyGameSnapshot } from "../initialCards";
import { ActiveAnimation } from "../animations/createAnimations";


export type GameState = {
  snapshotIndex: number;
  newSnapshotIndex: number;
  error: string;
  activePlayers: User[];
  activeAnimation?: ActiveAnimation;
  currSnapshot: GameSnapshot;
  newSnapshot?: GameSnapshot; 
  snapshots: GameSnapshot[];
};

const initialState: GameState = {
  snapshotIndex: 0,
  newSnapshotIndex: 0,
  currSnapshot: emptyGameSnapshot,
  snapshots: [],
  activeAnimation: undefined,
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
    setActiveAnimation : (state, action: PayloadAction<ActiveAnimation | undefined>) => {
      state.activeAnimation = action.payload;
    },
    resolveNewSnapshot: (state) => {
      state.activeAnimation = undefined;
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

export const {setInitialSnapshot, addNewSnapshots, setNewSnapshot, setActiveAnimation, resolveNewSnapshot, updateActivePlayers, setNotInGameError, testUpdateSnapshot } = gameSnapshotSlice.actions;

export default gameSnapshotSlice.reducer;
