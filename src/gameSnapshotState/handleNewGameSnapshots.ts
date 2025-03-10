import { all, put, takeEvery, call } from "redux-saga/effects";
// import { increment, setIterationsPlusFive } from "./counterSlice";
import { SagaIterator } from "redux-saga";
import store from "../redux/store";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    addNewSnapshots,
    resolveNewSnapshot,
    setActionResultsMap,
    setNewSnapshot,
} from "./gameSnapshotSlice";
import { setActiveAnimation } from "../animationState/animationState";
import { selectAnimation } from "../animations/selectAnimation";

const handleExistingSnapshots = (snapshots: GameSnapshot[]): GameSnapshot[] => {
    const existingSnapshots = store.getState().gameSnapshotState.snapshots;
    return snapshots.filter(
        (newSn) => !existingSnapshots.some((oldSn) => oldSn.index === newSn.index)
    );
};

export const sanitiseNewSnapshots = (
    user: User,
    gameData: GameData,
    snapshots: GameSnapshot[]
): GameSnapshot[] => {
    snapshots.sort((a, b) => a.index - b.index);

    const newSnapshots = handleExistingSnapshots(snapshots);
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
    const remainingSnapshots = snapshots.length - snapshotIndex - 1;
    if (remainingSnapshots < 1) {
        yield put({ type: setActiveAnimation.type, payload: undefined });
        return;
    }
    yield put({ type: setNewSnapshot.type });
    const { newSnapshot } = store.getState().gameSnapshotState;
    if (!newSnapshot) throw Error("No new snapshot!");
    const newActiveAnimation = selectAnimation(currSnapshot, newSnapshot);
    if (!newActiveAnimation) {
        const { snapshotUpdateData } = newSnapshot;
        if (snapshotUpdateData) {
            throw Error(
                "No active animation when trying to animate new snapshot with update type: " +
                    snapshotUpdateData.type
            );
        }
        throw Error("No active animation when trying to animate new snapshot -- update data not found");
    }
    yield put({ type: setActiveAnimation.type, payload: newActiveAnimation });
    yield call(resolveNewSnapshotFollowingAnimation, newActiveAnimation.totalDuration - 20);
}

function* queueNewServerSnapshots(action: PayloadAction<NewServerSnapshots>): SagaIterator {
    const { snapshots, user, gameData } = action.payload;
    const actionResultsMap = snapshots[snapshots.length - 1].actionResultsMap;

    const sanitisedSnapshots = sanitiseNewSnapshots(user, gameData, snapshots);
    if (sanitisedSnapshots.length === 0) {
        if (actionResultsMap) {
            yield put({ type: setActionResultsMap.type, payload: actionResultsMap });
        }
        return;
    }
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
    yield put({ type: setActionResultsMap.type, payload: undefined });
    console.log("handled new client snapshot", store.getState().gameSnapshotState.currSnapshot);
}

export function* watchNewSnapshots() {
    yield takeEvery("HANDLE_NEW_SERVER_SNAPSHOTS", queueNewServerSnapshots);
    yield takeEvery("HANDLE_NEW_CLIENT_SNAPSHOT", handleNewClientSnapshot);
    yield takeEvery("CANCEL_ANIMATION_TIMER", () => clearTimeout(timer));
}

export default function* rootSaga() {
    yield all([watchNewSnapshots()]);
}
