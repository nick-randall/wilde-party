import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { setLoadingWs, setWsError, setConnectedToWs, setDisconnectedFromWs } from "./websocketSlice";
import { addMessage, updateRoomUsers } from "../../features/chat/chatSlice";

export const stompMiddleware = ({ dispatch }) => {
  let stompClient;

  return next => action => {
    switch (action.type) {
      case "connectWs":
        dispatch(setLoadingWs());
        const socket = new SockJS("/ws");
        stompClient = Stomp.over(socket);

        stompClient.onStompError = function (frame) {
          dispatch(setWsError());
        };

        stompClient.onDisconnect = () => {
          dispatch(setDisconnectedFromWs());
        };

        stompClient.connect({}, () => {
          dispatch(setConnectedToWs());
        });

        break;
      case "joinChatRoom":
        const { username } = action.payload;

        const onChatMessageReceived = payload => {
          if (payload.body) {
            console.log("got global message");
            dispatch(addMessage(JSON.parse(payload.body)));
          } else {
            console.log("got empty message");
          }
        };
        stompClient.subscribe("/topic/public", onChatMessageReceived);
        stompClient.subscribe("/users/queue/messages", function (message) {
          console.log("Received personal message: " + message.body);
        });
        stompClient.subscribe("/topic/users-in-chat-room", function (message) {
          dispatch(updateRoomUsers(JSON.parse(message.body)));
        });

        // stompClient.subscribe("/topic/zebras-only", onMessageReceived);
        stompClient.send("/app/chat.joinRoom", {}, JSON.stringify({ sender: username, type: "JOIN" }));
        break;
      case "sendMessage": {
        const { username } = action.payload;
        console.log("sending message: " + username);
        // const { type, content, user } = action.payload;
        // stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ sender: user, type, content }));
        stompClient.send("/app/hello", {}, username);

        break;
      }
      case "SEND_MESSAGE_TO_ROOM": {
        const { currMsg } = action.payload;
        console.log("sending message to room: " + currMsg);
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: currMsg, type: "CHAT" }));
        break;
      }
      case "INVITE_USER_TO_GAME": {
        const { inviteeId } = action.payload;
        console.log("sending invite to user: " + inviteeId);
        stompClient.send("/app/invite", {}, inviteeId.toString());

        // stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: inviteeId, type: "invite" }));
        break;
      }
      case "disconnectWs":
        stompClient.disconnect();
        break;
      default:
        return next(action);
    }
  };
};

export const connectWebsocket = () => ({ type: "connectWs" });

export const joinChatRoom = username => ({ type: "joinChatRoom", payload: { username } });
// An action to disconnect stomp connection.
export const disconnectWebsocket = () => ({ type: "disconnectWs" });

export const sendMessage = (currMsg, user) => ({ type: "sendMessage", payload: { username: user.username } });

export const SEND_MESSAGE_TO_ROOM = currMsg => ({ type: "SEND_MESSAGE_TO_ROOM", payload: { currMsg } });

export const INVITE_USER_TO_GAME = inviteeId => ({ type: "INVITE_USER_TO_GAME", payload: { inviteeId } });
