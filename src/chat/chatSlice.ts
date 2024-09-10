import { ActionCreatorWithPayload, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    handleInvitation: (state, action:PayloadAction<IncomingInvitationMessage>) => {
      const {type, sender, userInvitations } = action.payload;
      console.log(`handleInvitation ${type}`, sender, userInvitations);
      if(type === "invite") {
        console.log("Invitation received from ", sender);
      }
    },
  },
});

export const { addMessage, updateRoomUsers, handleInvitation } = chatSlice.actions;

export default chatSlice.reducer;
