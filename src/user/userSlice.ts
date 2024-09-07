import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type UserGameState = {
  user?: User;
  gameId?: number;
  isLoading: boolean;
  error: string;
};

const initialState: UserGameState = { user: undefined, gameId: undefined, isLoading: false, error: "" };

export const whoami = createAsyncThunk("userGameState/whoami", async () => {
  //TODO handle network errors
  const whoamiResponse = await axios.post("/whoami");
  return whoamiResponse.data;
});

export const logout = createAsyncThunk("userGameState/logout", async () => {
  //TODO handle network errors

  await axios.post("/logout");
});

export const addUser = createAsyncThunk("user/addUser", async (username: string) => {
  const addUserRequest = { username: username };
  const resp = await axios.post("/addUser", addUserRequest);
  return resp.data;
});

const userSlice = createSlice({
  name: "userGameState",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(whoami.pending, state => {
      state.error = "";
      state.isLoading = true;
    });
    builder.addCase(whoami.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.gameId = action.payload.gameId;
      } else {
        state.user = {
          name: "",
          id: -1,
        };
      }
      state.isLoading = false;
    });
    builder.addCase(whoami.rejected, state => {
      console.log("whoami rejected");
      state.isLoading = false;
      state.error = "Error getting user info";
    });
    builder.addCase(addUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.user = action.payload;
      console.log(action.payload);

      state.isLoading = false;
    });
    builder.addCase(addUser.rejected, state => {
      state.isLoading = false;
      state.error = "Error adding user";
    });
    builder.addCase(logout.pending, state => {
      state.error = "";
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, state => {
      state.user = undefined;
      state.isLoading = false;
    });
    builder.addCase(logout.rejected, state => {
      state.isLoading = false;
      state.error = "Error logging out";
    });
  },
});


export default userSlice.reducer;
