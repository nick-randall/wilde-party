import { all, put, takeEvery, call } from "redux-saga/effects";
// import { increment, setIterationsPlusFive } from "./counterSlice";
import { SagaIterator } from "redux-saga";
import store from "../redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { createDealCardsAnimation, DealCardsArgs } from "../animations/createAnimations";
import { addNewSnapshots, resolveNewSnapshot, setNewSnapshot } from "./gameSnapshotSlice";
import { setActiveAnimation } from "../animationState/animationState";
import { off } from "process";
import { locatePlace } from "../helperFunctions/locateFunctions";
import { pipe } from "ramda";
import { selectAnimation } from "../animations/selectAnimation";

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

let timer: NodeJS.Timer;

const delay = (ms: number) =>
    new Promise((res) => {
        timer = setTimeout(res, ms);
    });

function* resolveNewSnapshotFollowingAnimation(duration: number) {
    yield call(delay, duration);
    yield put({ type: resolveNewSnapshot.type });
    yield put({ type: setActiveAnimation.type, payload: undefined });
    // const { snapshotIndex, snapshots } = store.getState().gameSnapshotState;
    // console.log("Resolved snapshot. curr index now: " + snapshotIndex);
    // const remainingSnapshots = snapshots.length - snapshotIndex;
    // console.log("num snapshots remaining: " + remainingSnapshots);

    // if (remainingSnapshots > 0) {
    yield call(continueHandlingSnapshots);
    // }
}

export function* continueHandlingSnapshots(): SagaIterator {
    const { snapshotIndex, snapshots, currSnapshot } = store.getState().gameSnapshotState;
    const { activeAnimation } = store.getState().animationState;
    const remainingSnapshots = snapshots.length - snapshotIndex - 1;
    if (remainingSnapshots < 1) {
        yield put({ type: setActiveAnimation.type, payload: undefined });
        return;
    }
    yield put({ type: setNewSnapshot.type });
    const { newSnapshot } = store.getState().gameSnapshotState;
    if (!newSnapshot) throw Error("No new snapshot!");
    const newActiveAnimation = selectAnimation(currSnapshot, newSnapshot);
    if (!newActiveAnimation) throw Error("No active animation!");
    yield put({ type: setActiveAnimation.type, payload: newActiveAnimation });
    yield call(resolveNewSnapshotFollowingAnimation, newActiveAnimation.totalDuration);
}

function* handleNewServerSnapshots(action: PayloadAction<NewServerSnapshots>): SagaIterator {
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

export function* handleNewClientSnapshot(action: PayloadAction<GameSnapshot>): SagaIterator {
    const newSnapshot = action.payload;
    yield put({ type: addNewSnapshots.type, payload: [newSnapshot] });
    // handle animations

    yield put({ type: resolveNewSnapshot.type });
}

export function* watchNewSnapshots() {
    yield takeEvery("HANDLE_NEW_SERVER_SNAPSHOTS", handleNewServerSnapshots);
    yield takeEvery("HANDLE_NEW_CLIENT_SNAPSHOT", handleNewClientSnapshot);
    yield takeEvery("CANCEL_ANIMATION_TIMER", () => clearTimeout(timer));
}

export default function* rootSaga() {
    yield all([watchNewSnapshots()]);
}


