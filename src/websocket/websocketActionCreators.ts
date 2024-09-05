export const connectWebsocket = (onConnectCallback: () => void): ConnectWebsocket => ({ type: "CONNECT_WS", payload: {onConnectCallback} });

export const joinChatRoom = (): JoinChatRoom => ({ type: "JOIN_CHAT_ROOM" });
// An action to disconnect stomp connection.

export const disconnectWebsocket = (): DisconnectWebsocket => ({ type: "DISCONNECT_WS" });

export const SEND_MESSAGE_TO_ROOM = (message: string): SendMessageToRoom => ({ type: "SEND_MESSAGE_TO_ROOM", payload: { message } });

export const INVITE_USER_TO_GAME = (inviteeId: number): InviteUserToGame => ({ type: "INVITE_USER_TO_GAME", payload: { inviteeId } });
