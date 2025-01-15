import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveAnimation } from "../animations/createAnimations";

interface OffsetMap {
  [key: string]: { dx: number; dy: number };
}




interface AnimationSliceState {
  offsetMap: OffsetMap;
  activeAnimation?: ActiveAnimation;

}

const initialState: AnimationSliceState = {
  offsetMap: {},
  activeAnimation: undefined,

};

const animationSlice = createSlice({
  name: "offsetMap",
  initialState,
  reducers: {
    appendOffsetMap: (state, action: PayloadAction<OffsetMap>) => {
      state.offsetMap = { ...state.offsetMap, ...action.payload };
    },
    setActiveAnimation : (state, action: PayloadAction<ActiveAnimation | undefined>) => {
      state.activeAnimation = action.payload;
    },
  },
});

export const { appendOffsetMap, setActiveAnimation } = animationSlice.actions;

export default animationSlice.reducer;
