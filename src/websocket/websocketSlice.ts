import { createSlice } from "@reduxjs/toolkit";

const initialState = { wsConnected: false, wsLoading: false, wsError: ""};

export const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setLoadingWs: state => {
      state.wsLoading = true;
      // state.wsError = "";
    },
    setWsError: (state, action) => {
      state.wsError = action.payload;
      state.wsLoading = false;
    },
    setConnectedToWs: state => {
      state.wsLoading = false;
      state.wsConnected = true;
      state.wsError = "";
    },
    setDisconnectedFromWs: state => {
      state.wsConnected = false;
      state.wsLoading = false;

    },
  },
});

export const { setLoadingWs, setWsError, setConnectedToWs, setDisconnectedFromWs } = websocketSlice.actions;

export default websocketSlice.reducer;
