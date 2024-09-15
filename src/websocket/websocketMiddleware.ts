import { CompatClient, Message, Stomp, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { setLoadingWs, setWsError, setConnectedToWs, setDisconnectedFromWs } from "./websocketSlice";
import { AppDispatch } from "../redux/store";
import { Middleware } from "redux";
import { connectWebsocket } from "./websocketActionCreators";
import { addMessage, handleChatRoomDataUpdate, updateRoomUsers } from "../chat/chatSlice";
import { handleNewGameSnapshots, setNotInGameError } from "../gameSnapshotState/gameSnapshotSlice";

export const stompMiddleware: Middleware = ({ dispatch }) => {
  let stompClient: CompatClient;
  let gameSubscription: StompSubscription;

  return (next: AppDispatch) => (action: WebsocketAction) => {
    // Allow the user to see that the connection is lost when trying to send messages etc.
    if (
      (action.type === "JOIN_CHAT_ROOM" ||
        action.type === "SEND_MESSAGE_TO_ROOM" ||
        action.type === "JOIN_GAME" ||
        action.type === "INVITE_USER_TO_GAME") &&
      (stompClient === undefined || !stompClient.active)
    ) {
      dispatch(setWsError(" Not connected to websocket"));
      return;
    }
    console.log(action.type);
    switch (action.type) {
      case "CONNECT_WS":
        const { actionOnConnect } = action.payload;
        dispatch(setLoadingWs());
        const socket = new SockJS("/ws");
        stompClient = Stomp.over(socket);

        stompClient.onStompError = function (frame) {
          dispatch(setWsError(frame.body));
        };

        stompClient.onWebSocketClose = () => {
          dispatch(setWsError("Lost connection to websocket"));
        };

        stompClient.onConnect = f => {
          console.log(f);
          // Subscribe to personal messages
          stompClient.subscribe("/users/queue/messages", (payload: Message) => {
            console.log("Received personal message: ");
            console.log(payload.body);
            // TODO create types for personal messages
            // const { type } = JSON.parse(payload.body);
            // if (type === "invite") {
            console.log("Received invite");
            dispatch(handleChatRoomDataUpdate(JSON.parse(payload.body)));
            // } else if (type === "not_in_game_error") {
            //   console.log("Error subscribing to game");
            //   gameSubscription.unsubscribe();
            //   dispatch(setNotInGameError(JSON.parse(payload.body)));
            // }
          });
          dispatch(setConnectedToWs());
          dispatch(actionOnConnect);
        };
        stompClient.activate();

        break;
      case "JOIN_CHAT_ROOM":
        if (!stompClient || !stompClient.connected) {
          dispatch(setWsError("Not connected to websocket"));
          return;
        }
        const onChatMessageReceived = (payload: Message) => {
          const message: ChatMessage = JSON.parse(payload.body);
          dispatch(addMessage(JSON.parse(payload.body)));

          if (message.type === "chat") {
          } else if (message.type === "join") {
            const usersInRooom = JSON.parse(message.content);
            dispatch(updateRoomUsers(usersInRooom));
          }
        };
        stompClient.subscribe("/topic/public", onChatMessageReceived);
        break;
      case "SEND_MESSAGE_TO_ROOM": {
        const message = action.payload;
        console.log("sending message to room: " + message);
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: message, type: "chat" }));
        break;
      }
      case "JOIN_GAME": {
        const { gameId } = action.payload;

        const handleIncomingSnapshots = (message: Message) => dispatch(handleNewGameSnapshots(JSON.parse(message.body)));
        // The game id will be checked on the server
        // to block subscription the user is not part of the game.
        const subscribeToGame = () => {
          gameSubscription = stompClient.subscribe(`/app/game/${gameId}`, handleIncomingSnapshots, { gameId: gameId.toString() });
        };

        subscribeToGame();
        break;
      }

      case "INVITE_USER_TO_GAME": {
        const { inviteeId } = action.payload;
        console.log("sending invite to user: " + inviteeId);
        const message: OutgoingInvitationMessage = { type: "invite", inviteeId };
        console.log(JSON.stringify(message));
        stompClient.send("/app/invitations", {}, JSON.stringify(message));

        // stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: inviteeId, type: "invite" }));
        break;
      }
      case "RESPOND_TO_INVITATION": {
        const { invitationId, accept } = action.payload;
        console.log("responding accept: " + accept + "  to invitation: " + invitationId);
        const message: OutgoingInvitationMessage = { type: accept? "accept" : "decline" , invitationId };
        console.log(JSON.stringify(message));
        stompClient.send("/app/invitations", {}, JSON.stringify(message));

        // stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: inviteeId, type: "invite" }));
        break;
      }
      case "DISCONNECT_WS":
        stompClient.disconnect();
        break;
      default:
        next(action);
    }
  };
};
