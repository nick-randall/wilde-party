import { all, put, takeEvery, call } from "redux-saga/effects";
// import { increment, setIterationsPlusFive } from "./counterSlice";
import { SagaIterator } from "redux-saga";
import store from "../redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { createDealCardsAnimation, DealCardsArgs } from "../animations/createAnimations";
import { addNewSnapshots, resolveNewSnapshot, setActiveAnimation } from "./gameSnapshotSlice";

const removeExistingSnapshots = (snapshots: GameSnapshot[]): GameSnapshot[] => {
  const existingSnapshots = store.getState().gameSnapshotState.snapshots;
  return snapshots.filter(newSn => !existingSnapshots.some(oldSn => oldSn.index !== newSn.index));
};

const modifySnapshotsPlayerOrder = (user: User, gameData: GameData, snapshots: GameSnapshot[]): GameSnapshot[] => {
  const { id: userId } = user;
  console.log(gameData);
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

export interface NewServerSnapshots {
  snapshots: GameSnapshot[];
  user: User;
  gameData: GameData;
  initial: boolean;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function* resolveNewSnapshotFollowingAnimation(duration: number) {
  yield call(delay, duration);
  yield put({ type: resolveNewSnapshot.type });
}

// ...

// Our worker Saga: will perform the async increment task

export function* handleNewServerSnapshots(action: PayloadAction<NewServerSnapshots>): SagaIterator {
  const { snapshots, user, gameData } = action.payload;
  snapshots.sort((a, b) => a.index - b.index);

  const newSnapshots = removeExistingSnapshots(snapshots);
  const modifiedSnapshots = modifySnapshotsPlayerOrder(user, gameData, newSnapshots);
  yield put({ type: addNewSnapshots.type, payload: modifiedSnapshots });
  const includesInitialSnapshot = modifiedSnapshots[0].index === 0
  if (includesInitialSnapshot) {
    yield call(delay, 1000);
  }
  
  //
  const dealtCardsSnapshot = snapshots[snapshots.length - 1];
  if (!dealtCardsSnapshot.snapshotUpdateData) throw Error("No snapshot update data!");
  const { snapshotIndex, currSnapshot, offsetMap } = store.getState().gameSnapshotState;

  // const dealCardsArgs: DealCardsArgs = {
  //   cardIds: dealtCardsSnapshot.snapshotUpdateData.playedCardIds,
  //   deckId: dealtCardsSnapshot.nonPlayerPlaces.deck.id,
  //   handId: dealtCardsSnapshot.snapshotUpdateData.targetId,
  //   oldSnapshot: currSnapshot,
  //   newSnapshot: dealtCardsSnapshot,
  //   placeRefMap: store.getState().gameSnapshotState.refMap,
  // };
  // const activeAnimation = createDealCardsAnimation(dealCardsArgs);
  // yield call(resolveNewSnapshotFollowingAnimation, activeAnimation.totalDuration);
  // yield put({ type: setActiveAnimation.type, payload: activeAnimation });
}

export function* handleNewClientSnapshot(action: PayloadAction<GameSnapshot>): SagaIterator {}

// Our watcher Saga: spawn a new handleNewSnapshots task on each INCREMENT_ASYNC
export function* watchNewSnapshots() {
  console.log("blah");
  yield takeEvery("HANDLE_NEW_SNAPSHOTS", handleNewServerSnapshots);
}
// export const newSnapshotsThunk =
//   (newSnapshots: GameSnapshot[]): ThunkAction<void, GameState, GameSnapshot[], HandleNewSnapshots> =>
//   (dispatch: Function, getState: () => GameState) => {

//     const { animDuration, animData } = processAnimationData(gameMessage.newSnapshots);
//     createHandToTableAnimation({});
//     setTimeout(dispatch(cancelAnimation(animData.id)), animDuration);
//     dispatch(startAnimations({ animData, fromServer: true }));
//   };

export default function* rootSaga() {
  yield all([watchNewSnapshots()]);
}
