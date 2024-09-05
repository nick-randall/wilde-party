import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "./websocket/websocketSlice";
import userReducer from "./user/userSlice";
import { stompMiddleware } from "./websocket/websocketMiddleware";
// import chatReducer from "./chat/chatSlice";

const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    user: userReducer,
    // chat: chatReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stompMiddleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export default store;
