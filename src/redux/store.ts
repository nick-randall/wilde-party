import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "../websocket/websocketSlice";
import userReducer from "../user/userSlice";
import { stompMiddleware } from "../websocket/websocketMiddleware";
import chatReducer from "../chat/chatSlice";
import dragEventReducer from "./dragEventReducer";

const store = configureStore({
  reducer: {
    dragEventState: dragEventReducer,
    websocket: websocketReducer,
    user: userReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stompMiddleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
