import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OffsetMap {
  [key: string]: { dx: number; dy: number };
}




interface OffsetMapState {
  offsetMap: OffsetMap;
}

const initialState: OffsetMapState = {
  offsetMap: {},
};

const offsetSlice = createSlice({
  name: "offsetMap",
  initialState,
  reducers: {
    appendOffsetMap: (state, action: PayloadAction<OffsetMap>) => {
      state.offsetMap = { ...state.offsetMap, ...action.payload };
    },
  },
});

export const { appendOffsetMap } = offsetSlice.actions;

export default offsetSlice.reducer;
