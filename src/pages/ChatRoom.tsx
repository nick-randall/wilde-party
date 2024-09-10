import React, { useEffect, useState } from "react";
import { connectWebsocket, inviteUserToGame, joinChatRoom, sendMessageToRoom } from "../websocket/websocketActionCreators";
import { useSelector, useDispatch } from "react-redux";
import ChatAvatar from "../components/ChatAvatar";
import { RootState } from "../redux/store";
import ChatMessageText from "../components/ChatMessage";
import { setConnectedToWs } from "../websocket/websocketSlice";
import { Center } from "../components/Center";
import LargeButton from "../components/LargeButton";
import "../css/chat-room.css";
import { useParams, useSearchParams } from "react-router-dom";

interface ChatRoomProps {
  user: User;
  gameData?: GameData;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user, gameData }) => {
  const [currMsg, setCurrMsg] = useState("");
  const dispatch = useDispatch();

  const { wsConnected, wsLoading, wsError } = useSelector((state: RootState) => state.websocket);
  const { messages, usersInRoom } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (!wsConnected && !wsLoading && !wsError) {
      dispatch(connectWebsocket({ actionOnConnect: joinChatRoom() }));
    }
  }, [dispatch, wsConnected, wsError, wsLoading]);

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrMsg(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currMsg) return;
    dispatch(sendMessageToRoom(currMsg));
    setCurrMsg("");
  };

  const inviteUser = (invitee: User) => {
    dispatch(inviteUserToGame(invitee.id));
  };

  // const [subscribed, setSubscribed] = useState(false);

  const usersInRoomWithoutSelf = usersInRoom.filter(roomUser => {
    console.log(roomUser);
    return roomUser.id !== user.id;
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     dispatch({ type: "INVITE_USER_TO_GAME", payload: { inviteeId: 1 } });
  //     // dispatch({ type: "SEND_MESSAGE_TO_ROOM", payload: { inviteeId: 1 } });

  //   }, 1000);
  // },[]);

  return (
    <div className="chat-room">
      {wsError && <div className="loading-overlay">Lost connection to chat...</div>}
      {wsLoading && <div className="loading-overlay">Connecting to Chat...</div>}
      {gameData && gameData.status === "created" && <GoToGame />}
      <div className="header">
        <div> Chat Room</div>
      </div>
      <div className="grid-left" style={{ display: "wrap" }}>
        <ChatAvatar name={user!.name} isMe />

        {usersInRoomWithoutSelf.map((roomUser, i) => {
          return <ChatAvatar key={i + "avatar"} name={roomUser.name} onClick={() => inviteUser(roomUser)} />;
        })}
      </div>
      <div className="chat-window grid-center">
        {messages.map((msg, i) => (
          <ChatMessageText msg={msg} onClick={() => inviteUser(msg.sender)} me={user!} key={`message-${i}`} />
        ))}
        <form onSubmit={handleSendMessage}></form>
        <div className="chat-input-row">
          <input value={currMsg} onChange={handleChatInputChange} />
          <img src="./send.svg" alt="send" onClick={handleSendMessage} className="send-button" />
        </div>
      </div>
      <div className="grid-right">Rules of the game</div>
      <div className="bottom"></div>
    </div>
  );
};

const GoToGame = () => {
  return (
    <Center>
      Your game is ready to begin!
      <LargeButton link="/game" text="Go to Game"></LargeButton>
    </Center>
  );
};

export default ChatRoom;
