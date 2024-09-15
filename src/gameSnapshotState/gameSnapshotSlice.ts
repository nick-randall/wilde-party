import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyGameSnapshot } from "../initialCards";

export type GameState = {
  error: string;
  activePlayers: User[];
  currSnapshot: GameSnapshot;
  newSnapshots: GameSnapshot[];
};

const initialState: GameState = {
  currSnapshot: emptyGameSnapshot,
  newSnapshots: [],
  error: "",
  activePlayers: [],
};

export const gameSnapshotSlice = createSlice({
  name: "gameSnapshot",
  initialState,
  reducers: {
    handleNewGameSnapshots: (state, action: PayloadAction<GameSnapshotUpdates>) => {
      const { type, newSnapshots } = action.payload;
      if (type !== "snapshots") return;
      if (newSnapshots.length === 0) return;

      state.newSnapshots = newSnapshots;
      console.log("this many new snapshots: " + newSnapshots.length);
      // const animationTemplates = createAnimationTemplates(gameSnapshot, newSnapshots[0], "server");

      // // If no animations are necessary to show updated state, update game state and deal with the next newsnaphots...
      // if (animationTemplates.length === 0) {
      //   console.log("no animation templates");
      //   replaceCurrentSnapshotWithNewSnapshot(newSnapshots[0]);
      //   handleNewSnapshots(getState().newSnapshots);
      //   return;
      // }
      // console.log(animationTemplates.length + " animation template groups");
      // // Otherwise set up the animation process
      // dispatch(setAnimationTemplates(animationTemplates));
    },
    setNotInGameError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateActivePlayers: (state, action: PayloadAction<User[]>) => {
      state.activePlayers = action.payload;
    },
  },
});

export const { handleNewGameSnapshots, setNotInGameError } = gameSnapshotSlice.actions;

export default gameSnapshotSlice.reducer;
