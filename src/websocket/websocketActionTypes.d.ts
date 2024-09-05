type ConnectWebsocket = { type: "CONNECT_WS"; payload: {onConnectCallback: () => void} };

type JoinChatRoom = { type: "JOIN_CHAT_ROOM" };

type JoinGame = { type: "JOIN_GAME", payload: { gameId: number } };


type DisconnectWebsocket = { type: "DISCONNECT_WS" };

type SendMessageToRoom = { type: "SEND_MESSAGE_TO_ROOM"; payload: { message: string } };

type InviteUserToGame = { type: "INVITE_USER_TO_GAME"; payload: { inviteeId: number } };

type WebsocketAction = ConnectWebsocket | JoinChatRoom | JoinGame | DisconnectWebsocket | SendMessageToRoom | InviteUserToGame;
