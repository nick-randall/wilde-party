import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  error: string;
  activePlayers: User[]
};

const initialState: GameState = { error: "", activePlayers: [] };

export const chatSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    handleNewGameSnapshots: (state, action: PayloadAction<GameSnapshotUpdates>) => {},
    setNotInGameError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateActivePlayers: (state, action: PayloadAction<User[]>) => { 
      state.activePlayers = action.payload;
    }

  },
});

export const {handleNewGameSnapshots, setNotInGameError} = chatSlice.actions;

export default chatSlice.reducer;
