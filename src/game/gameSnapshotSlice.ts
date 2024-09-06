import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  error: string;
};

const initialState: GameState = { error: "" };

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // case "DRAW_CARD":
    //   if (state.gameSnapshot.nonPlayerPlaces.deck.cards.length === 0) return state;
    //   const { player, handId } = action.payload;
    //   const gameSnapshot = drawCardUpdateSnapshot(handId, player, state.gameSnapshot);
    //   return { ...state, gameSnapshot };
    // case "CHANGE_NUM_DRAWS": {
    //   const change = action.payload;
    //   const newSnapshot = produce(state.gameSnapshot, draft => {
    //     draft.current.draws += change;
    //   });
    //   return { ...state, gameSnapshot: newSnapshot };
    // }
    // case "CHANGE_NUM_PLAYS": {
    //   const change = action.payload;
    //   const newSnapshot = produce(state.gameSnapshot, draft => {
    //     draft.current.plays += change;
    //   });
    //   return { ...state, gameSnapshot: newSnapshot };
    // }
    // case "CHANGE_NUM_ROLLS": {
    //   const change = action.payload;
    //   const newSnapshot = produce(state.gameSnapshot, draft => {
    //     draft.current.draws += change;
    //   });
    //   return { ...state, gameSnapshot: newSnapshot };
    // }
    // case "END_CURRENT_PHASE":
    //   // currently only ends the deal phase
    //   const phases: Phase[] = ["dealPhase", "playPhase", "drawPhase", "rollPhase", "counterPhase"];
    //   const newSnapshot = produce(state.gameSnapshot, draft => {
    //     switch (state.gameSnapshot.current.phase) {
    //       case "dealPhase":
    //         draft.current.phase = "drawPhase";
    //         break;
    //       case "drawPhase":
    //         draft.current.phase = "playPhase";
    //         break;
    //       default:
    //         draft.current.phase = "playPhase";
    //     }
    //   });
    //   console.log("here");
    //   return { ...state, gameSnapshot: newSnapshot };
    // case "END_CURRENT_TURN": {
    //   const { gameSnapshot } = state;
    //   const newSnapshot = produce(gameSnapshot, draft => {
    //     draft.current.player = nextPlayer(gameSnapshot);
    //     draft.current.draws = 1;
    //     draft.current.plays = 1;
    //     draft.current.rolls = 1;
    //     draft.current.phase = "drawPhase";
    //   });
    //   console.log(newSnapshot);
    //   return { ...state, gameSnapshot: newSnapshot };
    // }
    },
  },
)

// export const {handleNewGameSnapshots, setNotInGameError} = chatSlice.actions;

export default chatSlice.reducer;




// return { ...state, gameSnapshot, transitionData: [...state.transitionData, newTransition] };