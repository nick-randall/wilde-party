export const connectWebsocket = ({actionOnConnect}: {actionOnConnect: WebsocketAction}): ConnectWebsocket => ({ type: "CONNECT_WS", payload: { actionOnConnect } });

export const joinChatRoom = (): JoinChatRoom => ({ type: "JOIN_CHAT_ROOM" });
export const joinGame = (gameId: number): JoinGame => ({ type: "JOIN_GAME", payload: { gameId } });

// An action to disconnect stomp connection.

export const disconnectWebsocket = (): DisconnectWebsocket => ({ type: "DISCONNECT_WS" });

export const sendMessageToRoom = (message: string): SendMessageToRoom => ({ type: "SEND_MESSAGE_TO_ROOM", payload:  message  });

export const inviteUserToGame = (inviteeId: number): InviteUserToGame => ({ type: "INVITE_USER_TO_GAME", payload: { inviteeId } });
