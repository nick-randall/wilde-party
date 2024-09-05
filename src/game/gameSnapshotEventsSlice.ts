import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  error: string;
};

const initialState: GameState = { error: "" };

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    handleNewGameSnapshots: (state, action: PayloadAction<GameSnapshotUpdates>) => {},
    setNotInGameError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {handleNewGameSnapshots, setNotInGameError} = chatSlice.actions;

export default chatSlice.reducer;
