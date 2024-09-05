import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatState = {
  messages: ChatMessage[];
  usersInRoom: User[];
  invitations: { inviter: User }[];
};

const initialState: ChatState = { messages: [], usersInRoom: [], invitations: [] };

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      console.log("addMessage", action.payload);
      state.messages.push(action.payload);
    },
    updateRoomUsers: (state, action) => {
      console.log("updateRoomUsers", action.payload);
      state.usersInRoom = action.payload;
    },
    addInvitation: (state, action) => {
      state.invitations.push(action.payload);
    },
  },
});

export const { addMessage, updateRoomUsers, addInvitation } = chatSlice.actions;

export default chatSlice.reducer;
