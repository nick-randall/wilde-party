type ConnectWebsocket = { type: "CONNECT_WS"; payload: { actionOnConnect: WebsocketAction } };

type PageWithWs = "chat" | "game";

type JoinChatRoom = { type: "JOIN_CHAT_ROOM" };

type JoinGame = { type: "JOIN_GAME"; payload: { gameId: number } };

type SendGameMessage = { type: "SEND_GAME_MESSAGE"; payload: { gameId: number, gameSnapshot: GameSnapshot } };


type DisconnectWebsocket = { type: "DISCONNECT_WS" };

type SendMessageToRoom = { type: "SEND_MESSAGE_TO_ROOM"; payload: string };

type InviteUserToGame = { type: "INVITE_USER_TO_GAME"; payload: { inviteeId: number } };

type RespondToInvitation = { type: "RESPOND_TO_INVITATION"; payload: { invitationId: number; accept: boolean } };

type WebsocketAction =  ConnectWebsocket | JoinChatRoom | JoinGame | DisconnectWebsocket | SendMessageToRoom | InviteUserToGame | RespondToInvitation | SendGameMessage;
