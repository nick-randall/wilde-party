import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type UserGameState = {
    user?: User;
    myIndex: number;
    gameData?: GameData;
    isLoading: boolean;
    isUserGameDataRetrieved: boolean;
    error: string;
};

const initialState: UserGameState = {
    isUserGameDataRetrieved: false,
    myIndex: 0,
    user: undefined,
    gameData: undefined,
    isLoading: false,
    error: "",
};

export const whoami = createAsyncThunk("userGameState/whoami", async () => {
    //TODO handle network errors
    const whoamiResponse = await axios.post("/whoami");
    return whoamiResponse.data;
});

export const logout = createAsyncThunk("userGameState/logout", async () => {
    //TODO handle network errors
    console.log("logging out");
    await axios.post("/logout");
});

export const addUser = createAsyncThunk("user/addUser", async (username: string) => {
    const addUserRequest = { username: username };
    const resp = await axios.post("/addUser", addUserRequest);
    return resp.data;
});

export const endGame = createAsyncThunk("user/endGame", async () => {
    console.log("ending game");
    const resp = await axios.post("/end-game");
    return resp.data;
});

export const justCreateDemoGame = createAsyncThunk("user/createDemoGame", async () => {
    console.log("creating demo game");
    const res = await axios.post("/just-create-game");
    return res.data;
});

const userSlice = createSlice({
    name: "userGameState",
    initialState,
    reducers: {
        setMyIndex: (state, action) => {
            state.myIndex = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(whoami.pending, (state) => {
            state.error = "";
            state.isLoading = true;
        });
        builder.addCase(whoami.fulfilled, (state, action) => {
            if (action.payload) {
                console.log(action.payload);
                state.user = action.payload.user;
                state.gameData = action.payload.gameData;
            } else {
            }
            state.isUserGameDataRetrieved = true;

            state.isLoading = false;
        });
        builder.addCase(whoami.rejected, (state) => {
            console.log("whoami rejected");
            state.isLoading = false;
            state.isUserGameDataRetrieved = false;
            state.error = "Error getting user info";
        });
        builder.addCase(addUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.user = action.payload;
            console.log(action.payload);
            state.isUserGameDataRetrieved = true;

            state.isLoading = false;
        });
        builder.addCase(addUser.rejected, (state) => {
            state.isLoading = false;
            state.error = "Error adding user";
        });
        builder.addCase(logout.pending, (state) => {
            state.error = "";
            state.isLoading = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.user = undefined;
            state.isLoading = false;
        });
        builder.addCase(logout.rejected, (state) => {
            state.isLoading = false;
            state.error = "Error logging out";
        });

        builder.addCase(endGame.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(endGame.rejected, (state) => {
          state.error = "Error ending game";
          state.isLoading = false;
        })
        builder.addCase(endGame.fulfilled, (state) => {
          console.log("success deleting game");
          state.isLoading = false;
          state.gameData = undefined;
        });

        builder.addCase(justCreateDemoGame.pending, (state) => {
            state.isLoading = true;
            state.error = "";
            console.log("pending just create game");
        });
        builder.addCase(justCreateDemoGame.rejected, (state) => {
            state.error = "Error creating demo game.";
            state.isLoading = false;
        });
        builder.addCase(justCreateDemoGame.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.gameData = action.payload.gameData;
        });
    },
});

export const { setMyIndex } = userSlice.actions;

export default userSlice.reducer;
