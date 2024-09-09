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
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (wsLoading || wsError) return;
    if (!wsConnected) {
      dispatch(connectWebsocket());
    }
  }, [dispatch, wsConnected, wsError, wsLoading]);

  useEffect(() => {
    if (wsConnected && !subscribed) {
      dispatch(joinChatRoom());
      setSubscribed(true);
    }
  }, [user, wsConnected, subscribed, dispatch, wsLoading, wsError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
console.log(`wsConnected ${wsConnected} wsLoading ${wsLoading} gameData ${gameData} messages ${messages} usersInRoom ${usersInRoom} subscribed ${subscribed} usersInRoomWithoutSelf ${usersInRoomWithoutSelf}`);
  return (
    <div className="chat-room">
      {!wsConnected && <div className="loading-overlay">Lost connection to chat...</div>}

      {wsLoading && <div className="loading-overlay">Connecting to Chat...</div>}
      {gameData && gameData.status === "created" && <GoToGame />}
      <div className="header">
        <div> Chat Room</div>
      </div>
      <div className="grid-left" style={{ display: "wrap" }}>
        <ChatAvatar name={user!.name} index={0} isMe />

        {usersInRoomWithoutSelf.map((roomUser, i) => {
          return <ChatAvatar name={roomUser.name} index={i} onClick={() => inviteUser(roomUser)} />;
        })}
      </div>
      <div className="chat-window grid-center">
        {messages.map((msg, i) => (
          <ChatMessageText msg={msg} onClick={() => inviteUser(msg.sender)} me={user!} key={`message-${i}`} />
        ))}
        <form onSubmit={handleSendMessage}></form>
        <div className="chat-input-row">
          <input value={currMsg} onChange={handleChange} />
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
