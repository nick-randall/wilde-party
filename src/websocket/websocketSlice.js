import { createSlice } from "@reduxjs/toolkit";

const initialState = { wsConnected: false, wsLoading: false, wsError: ""};

export const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setLoadingWs: state => {
      state.wsLoading = true;
    },
    setWsError: state => {
      state.wsError = "An error occurred";
    },
    setConnectedToWs: state => {
      state.wsLoading = false;
      state.wsConnected = true;
    },
    setDisconnectedFromWs: state => {
      state.wsConnected = false;
    },
  },
});

export const { setLoadingWs, setWsError, setConnectedToWs, setDisconnectedFromWs } = websocketSlice.actions;

export default websocketSlice.reducer;
