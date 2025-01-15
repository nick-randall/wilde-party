import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "../websocket/websocketSlice";
import userReducer from "../user/userSlice";
import { stompMiddleware } from "../websocket/websocketMiddleware";
import chatReducer from "../chat/chatSlice";
import dragEventReducer from "./dragEventSlice";
import gameSnapshotReducer from "../gameSnapshotState/gameSnapshotSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../gameSnapshotState/handleNewGameSnapshots";
import offsetMapReducer from "../animationState/animationState";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    dragEventState: dragEventReducer,
    websocket: websocketReducer,
    userGameState: userReducer,
    gameSnapshotState: gameSnapshotReducer,
    animationState: offsetMapReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stompMiddleware).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);


export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
