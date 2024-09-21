import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyGameSnapshot } from "../initialCards";
import store from "../redux/store";

export type GameState = {
  snapshotIndex: number;
  newSnapshotIndex: number;
  error: string;
  activePlayers: User[];
  animationData: AnimationData[];
  currSnapshot: GameSnapshot;
  snapshots: GameSnapshot[];
};

const initialState: GameState = {
  snapshotIndex: 0,
  newSnapshotIndex: 0,
  currSnapshot: emptyGameSnapshot,
  snapshots: [],
  animationData: [],
  error: "",
  activePlayers: [],
};

export const gameSnapshotSlice = createSlice({
  name: "gameSnapshot",
  initialState,
  reducers: {
    handleNewGameSnapshots: (state, action: PayloadAction<{snapshots: GameSnapshot[], gameData?: GameData}>) => {
      console.log("handling new game snapshots");
      console.log(action.payload);
      const {snapshots, gameData} = action.payload;
      const newSnapshots = snapshots.filter(snapshot => snapshot.index > state.snapshotIndex);
      newSnapshots.sort((a, b) => a.index - b.index);
      if (newSnapshots.length === 0) return;

      if (!gameData) return;
      const modifiedSnapshots = modifySnapshotsPlayerOrder(gameData, newSnapshots);

      state.snapshots.push(...modifiedSnapshots);
      const startAnimatingChanges = () => {
        if (state.newSnapshotIndex >= state.snapshots.length) return;
        state.newSnapshotIndex++;

        if (state.animationData.length > 0) {
          // If there are still animations in progress, wait for them to finish
          return;
        } else {
          // Create animations for the new snapshots
          console.log("creating animations for snapshot " + state.newSnapshotIndex);
          state.snapshotIndex++;
          state.currSnapshot = state.snapshots[state.snapshotIndex];
          setTimeout(startAnimatingChanges, 1000);
        }
      };
      startAnimatingChanges();
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

const modifySnapshotsPlayerOrder = (gameData: GameData, snapshots: GameSnapshot[]): GameSnapshot[] => {
  const { id: userId } = gameData;
  return snapshots.map(snapshot => ({
    ...snapshot,
    players: modifyPlayerOrder(userId, snapshot.players),
  }));
};

const modifyPlayerOrder = (userId: number, players: GamePlayer[]): GamePlayer[] => {
  const playerIndex = players.findIndex(player => player.userId === userId);
  const playersCopy = [...players];
  const numPlayersAfterUser = playersCopy.length - playerIndex;
  const playersAfterUser = playersCopy.splice(playerIndex, numPlayersAfterUser);
  const result = playersAfterUser.concat(playersCopy);

  return result;
};

export const { handleNewGameSnapshots, updateActivePlayers, setNotInGameError } = gameSnapshotSlice.actions;

export default gameSnapshotSlice.reducer;
