import { CompatClient, Message, Stomp, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { setLoadingWs, setWsError, setConnectedToWs } from "./websocketSlice";
import store, { AppDispatch } from "../redux/store";
import { Middleware } from "redux";
import { addMessage, handleChatRoomDataUpdate, updateRoomUsers } from "../chat/chatSlice";
import { setNotInGameError, updateActivePlayers } from "../gameSnapshotState/gameSnapshotSlice";
import { NewServerSnapshots } from "../gameSnapshotState/handleNewGameSnapshots";

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
          dispatch(setConnectedToWs());
          dispatch(actionOnConnect);
        };
        stompClient.debug = () => {};
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
        const onChatRoomDataUpdate = (payload: Message) => {
          dispatch(handleChatRoomDataUpdate(JSON.parse(payload.body)));
        };
        // Subscribe to personal messages
        stompClient.subscribe("/users/queue/messages", onChatRoomDataUpdate);
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

        const onIncomingGameBroadcast = (message: Message) => {
          const gameMessage: IncomingGameMessage = JSON.parse(message.body);
          console.log(gameMessage);
          if (gameMessage.type === "join") {
            if (!gameMessage.activePlayers) throw new Error("No active players in game message");
            dispatch(updateActivePlayers(gameMessage.activePlayers));
          } else if (gameMessage.type === "gameSnapshots") {
            if (gameMessage.newSnapshots === undefined) throw new Error("No new snapshots in game message");

            const { gameData, user } = store.getState().userGameState;
            if (!gameData || !user) throw new Error("No game data or user in game state");
            const payload : NewServerSnapshots = { snapshots: gameMessage.newSnapshots, user, gameData, initial: false };
            dispatch({
              type: "HANDLE_NEW_SNAPSHOTS",
              payload
            });

            // dispatch(handleNewGameSnapshots({ snapshots: gameMessage.newSnapshots, user, gameData }));
          }
        };
        const onPersonalMessageReceived = (payload: Message) => {
          // console.log("Received personal game message: ");
          const message: GamePersonalMessage = JSON.parse(payload.body);
          // console.log(message);
          // console.log(message.type);
          // console.log(message.initialGameSnapshots);
          // if (message.type === "initialGameSnapshots") {
          //   const { gameData, user } = store.getState().userGameState;
          //   if (!message.initialGameSnapshots) throw new Error("No initial snapshots in personal message");
          //   if (!gameData || !user) throw new Error("No game data or user in game state");
          //   const modifiedSnapshots = sanitiseNewSnapshots(user, gameData, message.initialGameSnapshots)
          //   dispatch(setInitialSnapshot(modifiedSnapshots[0]));
          // } else 
          if (message.type === "notInGameError") {
            gameSubscription.unsubscribe();
            dispatch(setNotInGameError(JSON.parse(payload.body)));
          }
        };

        // Subscribe to personal messages
        stompClient.subscribe("/users/queue/messages", onPersonalMessageReceived);
        // The game id will be checked on the server
        // to block subscription the user is not part of the game.
        gameSubscription = stompClient.subscribe(`/topic/game/${gameId}`, onIncomingGameBroadcast, { gameId: gameId.toString() });
        break;
      }

      case "INVITE_USER_TO_GAME": {
        const { inviteeId } = action.payload;
        const message: OutgoingInvitationMessage = { type: "invite", inviteeId };
        stompClient.send("/app/invitations", {}, JSON.stringify(message));

        // stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: inviteeId, type: "invite" }));
        break;
      }
      case "RESPOND_TO_INVITATION": {
        const { invitationId, accept } = action.payload;
        const message: OutgoingInvitationMessage = { type: accept ? "accept" : "decline", invitationId };
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
