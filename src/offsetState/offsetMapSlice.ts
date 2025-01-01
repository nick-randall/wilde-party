import { createSlice } from "@reduxjs/toolkit";

interface OffsetMapState {
  offsetMap: { [key: string]: { dx: number; dy: number } };
}

const initialState: OffsetMapState = {
  offsetMap: {},
};

const offsetSlice = createSlice({
  name: "offsetMap",
  initialState,
  reducers: {
    appendOffsetMap: (state, action) => {
      state.offsetMap = { ...state.offsetMap, ...action.payload };
    },
  },
});

export const { appendOffsetMap } = offsetSlice.actions;

export default offsetSlice.reducer;
