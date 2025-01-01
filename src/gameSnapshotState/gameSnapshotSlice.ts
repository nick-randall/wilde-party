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
      state.currSnapshot = action.payload;
      state.snapshots.push(action.payload);
    },
    addNewSnapshots: (state, action: PayloadAction<GameSnapshot[]>) => {
      const newSnapshots = action.payload;
      state.snapshots.push(...newSnapshots);
      if(newSnapshots[0].index === 0) {
        state.currSnapshot = newSnapshots[0];
      }
    },
    setActiveAnimation : (state, action: PayloadAction<ActiveAnimation>) => {
      state.activeAnimation = action.payload;
      state.newSnapshotIndex = state.snapshotIndex + 1;
      state.newSnapshot = state.snapshots[state.newSnapshotIndex];
      console.log("setting active animation");
      console.log("current snapshot index is " + state.snapshotIndex);
      console.log("updated new snapshot index to " + state.newSnapshotIndex);
    },
    resolveNewSnapshot: (state) => {
      state.activeAnimation = undefined;
      state.snapshotIndex ++;
      state.currSnapshot = state.snapshots[state.snapshotIndex];
    },
    // handleNewGameSnapshots: (state, action: PayloadAction<{snapshots: GameSnapshot[], gameData?: GameData, user?: User}>) => {
    //   console.log("handling new game snapshots");
    //   console.log(action.payload);
    //   const {snapshots, gameData, user} = action.payload;
    //   const newSnapshots = snapshots.filter(snapshot => snapshot.index > state.snapshotIndex);
      // newSnapshots.sort((a, b) => a.index - b.index);
    //   if (newSnapshots.length === 0) return;
    //   console.log(user)
    //   if (!gameData || !user) return;
    //   const modifiedSnapshots = modifySnapshotsPlayerOrder(user, gameData, newSnapshots);

    //   state.snapshots.push(...modifiedSnapshots);
    //   const startAnimatingChanges = () => {
    //     if (state.newSnapshotIndex >= state.snapshots.length) return;
    //     state.newSnapshotIndex++;

    //     if (state.animationData.length > 0) {
    //       // If there are still animations in progress, wait for them to finish
    //       return;
    //     } else {
    //       // Create animations for the new snapshots
    //       console.log("creating animations for snapshot " + state.newSnapshotIndex);
    //       state.snapshotIndex = 5;
    //       console.log(snapshots[state.snapshotIndex]);
    //       state.currSnapshot = state.snapshots[state.snapshotIndex];
    //       // setTimeout(startAnimatingChanges, 1000);
    //     }
    //   };
      // startAnimatingChanges();
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
    // },
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

const modifySnapshotsPlayerOrder = (user: User,  gameData: GameData, snapshots: GameSnapshot[]): GameSnapshot[] => {
  const { id: userId } = user;
  console.log(gameData)
  return snapshots.map(snapshot => ({
    ...snapshot,
    players: modifyPlayerOrder(userId, snapshot.players),
  }));
};

const modifyPlayerOrder = (userId: number, players: GamePlayer[]): GamePlayer[] => {
  console.log("my user id is " + userId);
  console.log("players are");
  console.log(players);
  const playerIndex = players.findIndex(player => player.userId === userId);
  const playersCopy = [...players];
  const numPlayersAfterUser = playersCopy.length - playerIndex;
  const playersAfterUser = playersCopy.splice(playerIndex, numPlayersAfterUser);
  const result = playersAfterUser.concat(playersCopy);

  return result;
};

export const {setInitialSnapshot, addNewSnapshots, setActiveAnimation, resolveNewSnapshot, updateActivePlayers, setNotInGameError, testUpdateSnapshot } = gameSnapshotSlice.actions;

export default gameSnapshotSlice.reducer;
