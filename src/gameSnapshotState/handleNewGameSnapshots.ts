import { all, put, takeEvery, call } from "redux-saga/effects";
// import { increment, setIterationsPlusFive } from "./counterSlice";
import { SagaIterator } from "redux-saga";
import store from "../redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { createDealCardsAnimation, DealCardsArgs } from "../animations/createAnimations";
import {
    addNewSnapshots,
    resolveNewSnapshot,
    setActiveAnimation,
    setNewSnapshot,
} from "./gameSnapshotSlice";
import { off } from "process";
import { locatePlace } from "../helperFunctions/locateFunctions";
import { pipe } from "ramda";

const removeExistingSnapshots = (snapshots: GameSnapshot[]): GameSnapshot[] => {
    const existingSnapshots = store.getState().gameSnapshotState.snapshots;
    return snapshots.filter(
        (newSn) => !existingSnapshots.some((oldSn) => oldSn.index === newSn.index)
    );
};

const modifySnapshotsPlayerOrder = (
    user: User,
    gameData: GameData,
    snapshots: GameSnapshot[]
): GameSnapshot[] => {
    const { id: userId } = user;
    return snapshots.map((snapshot) => ({
        ...snapshot,
        players: modifyPlayerOrder(userId, snapshot.players),
    }));
};

const modifyPlayerOrder = (userId: number, players: GamePlayer[]): GamePlayer[] => {
    const playerIndex = players.findIndex((player) => player.userId === userId);
    const playersCopy = [...players];
    const numPlayersAfterUser = playersCopy.length - playerIndex;
    const playersAfterUser = playersCopy.splice(playerIndex, numPlayersAfterUser);
    const result = playersAfterUser.concat(playersCopy);

    return result;
};

export const sanitiseNewSnapshots = (
    user: User,
    gameData: GameData,
    snapshots: GameSnapshot[]
): GameSnapshot[] => {
    snapshots.sort((a, b) => a.index - b.index);

    const newSnapshots = removeExistingSnapshots(snapshots);
    // const modifiedSnapshots = modifySnapshotsPlayerOrder(user, gameData, newSnapshots);
    return newSnapshots;
};

export interface NewServerSnapshots {
    snapshots: GameSnapshot[];
    user: User;
    gameData: GameData;
    initial: boolean;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function* resolveNewSnapshotFollowingAnimation(duration: number) {
    yield call(delay, duration);
    yield put({ type: resolveNewSnapshot.type });
    // const { snapshotIndex, snapshots } = store.getState().gameSnapshotState;
    // console.log("Resolved snapshot. curr index now: " + snapshotIndex);
    // const remainingSnapshots = snapshots.length - snapshotIndex;
    // console.log("num snapshots remaining: " + remainingSnapshots);

    // if (remainingSnapshots > 0) {
    yield call(continueHandlingSnapshots);
    // }
}

export function* continueHandlingSnapshots(): SagaIterator {
    const { snapshotIndex, snapshots, currSnapshot, activeAnimation } = store.getState().gameSnapshotState;
    const remainingSnapshots = snapshots.length - snapshotIndex - 1;
    if (remainingSnapshots < 1) {
        yield put({ type: setActiveAnimation.type, payload: undefined });
        return;
    }
    yield put({ type: setNewSnapshot.type });
    const { newSnapshot } = store.getState().gameSnapshotState;
    const dealtCardsSnapshot = newSnapshot;
    if (!dealtCardsSnapshot?.snapshotUpdateData) throw Error("No snapshot update data!");
    const { offsetMap } = store.getState().offsetMapState;

    const dealCardsArgs: DealCardsArgs = {
        cardIds: dealtCardsSnapshot.snapshotUpdateData.playedCardIds,
        deckId: dealtCardsSnapshot.nonPlayerPlaces.deck.id,
        handId: dealtCardsSnapshot.snapshotUpdateData.targetId,
        oldSnapshot: currSnapshot,
        newSnapshot: dealtCardsSnapshot,
        offsetMap: offsetMap,
    };
    const newActiveAnimation = createDealCardsAnimation(dealCardsArgs);
    yield put({ type: setActiveAnimation.type, payload: newActiveAnimation });
    yield call(resolveNewSnapshotFollowingAnimation, newActiveAnimation.totalDuration);

}

export function* handleNewServerSnapshots(action: PayloadAction<NewServerSnapshots>): SagaIterator {
    const { snapshots, user, gameData } = action.payload;
    const sanitisedSnapshots = sanitiseNewSnapshots(user, gameData, snapshots);
    if (sanitisedSnapshots.length === 0) return;
    yield put({ type: addNewSnapshots.type, payload: sanitisedSnapshots });

    const includesInitialSnapshot = sanitisedSnapshots[0].index === 0;
    if (includesInitialSnapshot) {
        yield call(delay, 500);
    }

    yield call(continueHandlingSnapshots);
}

export function* handleNewClientSnapshot(action: PayloadAction<GameSnapshot>): SagaIterator {}

export function* watchNewSnapshots() {
    yield takeEvery("HANDLE_NEW_SNAPSHOTS", handleNewServerSnapshots);
}

export default function* rootSaga() {
    yield all([watchNewSnapshots()]);
}
