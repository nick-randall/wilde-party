import { CompatClient, Message, Stomp, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { setLoadingWs, setWsError, setConnectedToWs, setDisconnectedFromWs } from "./websocketSlice";
import { AppDispatch } from "../store";
import { Middleware } from "redux";
import { connectWebsocket } from "./websocketActionCreators";
import { addInvitation, addMessage, updateRoomUsers } from "../chat/chatSlice";
import { handleNewGameSnapshots, setNotInGameError } from "../game/gameSnapshotEventsSlice";

export const stompMiddleware: Middleware = ({ dispatch }) => {
  let stompClient: CompatClient;
  let gameSubscription: StompSubscription;

  return (next: AppDispatch) => (action: WebsocketAction) => {
    // Allow the user to see that the connection is lost when trying to send messages etc.
    if (action.type !== "CONNECT_WS") {
      if (stompClient === undefined || !stompClient.active) {
        dispatch(setDisconnectedFromWs());
        return;
      }
    }
    switch (action.type) {
      case "CONNECT_WS":
        const { onConnectCallback } = action.payload;
        dispatch(setLoadingWs());
        const socket = new SockJS("/ws");
        stompClient = Stomp.over(socket);

        stompClient.onStompError = function (frame) {
          dispatch(setWsError());
        };

        stompClient.onDisconnect = () => {
          dispatch(setDisconnectedFromWs());
        };

        stompClient.onConnect = onConnectCallback;

        stompClient.connect({}, () => {
          dispatch(setConnectedToWs());
        });

        break;
      case "JOIN_CHAT_ROOM":
        const onChatMessageReceived = (payload: Message) => {
          if (payload.body) {
            console.log("got global message");
            dispatch(addMessage(JSON.parse(payload.body)));
          } else {
            console.log("got empty message");
          }
        };
        const onRoomUsersReceived = (payload: Message) => {
          dispatch(updateRoomUsers(JSON.parse(payload.body)));
        };
        const onPersonalMessageReceived = (payload: Message) => {
          console.log("Received personal message: ");
          const { type } = JSON.parse(payload.body);
          if (type === "invite") {
            console.log("Received invite");
            dispatch(addInvitation(JSON.parse(payload.body)));
          } else if (type === "not_in_game_error") {
            console.log("Error subscribing to game");
            gameSubscription.unsubscribe();
            dispatch(setNotInGameError(JSON.parse(payload.body)));
          }
        };
        stompClient.subscribe("/users/queue/messages", onPersonalMessageReceived);
        stompClient.subscribe("/topic/public", onChatMessageReceived);
        stompClient.subscribe("/topic/users-in-chat-room", onRoomUsersReceived);
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
          gameSubscription = stompClient.subscribe(`/app/game/${gameId}`, handleIncomingSnapshots);
        };

        if (!stompClient.active) {
          // If the connection is lost, defer subscription to the connect websocket event.
          dispatch(connectWebsocket(subscribeToGame));
        } else subscribeToGame();
        break;
      }

      case "INVITE_USER_TO_GAME": {
        const { inviteeId } = action.payload;
        console.log("sending invite to user: " + inviteeId);
        stompClient.send("/app/invite", {}, inviteeId.toString());

        // stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: inviteeId, type: "invite" }));
        break;
      }
      case "DISCONNECT_WS":
        stompClient.disconnect();
        break;
      default:
        return next(action);
    }
  };
};
