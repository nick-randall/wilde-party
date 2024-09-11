import { ActionCreatorWithPayload, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatState = {
  messages: ChatMessage[];
  usersInRoom: User[];
  receivedInvitations: Invitation[];
  sentInvitations: Invitation[];
  gameData?: GameData;
};

const initialState: ChatState = {
  messages: [],
  usersInRoom: [],
  receivedInvitations: [],
  sentInvitations: [],
  gameData: undefined,
};

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
    handleInvitation: (state, action: PayloadAction<IncomingInvitationMessage>) => {
      const { type, message, sentInvitations, receivedInvitations, gameData } = action.payload;
      console.log(`type: "${type}", message: ${message}, sentInvitations: ${sentInvitations}, receivedInvitations: ${receivedInvitations}, gameData: ${gameData} `);
      // if (type === "invite") {
        console.log("Invitation message received");
        state.messages.push({ type: "chat", content: message, sender: { id: -1, name: "System" } });
        state.sentInvitations = sentInvitations;
        state.receivedInvitations = receivedInvitations;
        state.gameData = gameData;
      // }
    },
  },
});

export const { addMessage, updateRoomUsers, handleInvitation } = chatSlice.actions;

export default chatSlice.reducer;
