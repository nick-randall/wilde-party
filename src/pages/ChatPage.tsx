import React, { useEffect, useState } from "react";
import { inviteUserToGame, joinChatRoom, sendMessageToRoom } from "../websocket/websocketActionCreators";
import { useSelector, useDispatch } from "react-redux";
import ChatAvatar  from "../components/ChatAvatar";
import { RootState } from "../redux/store";
import useUserGameData from "../user/useUserGameData";
import  ChatMessageText from "../components/ChatMessage";

const ChatRoom = () => {
  const { isUserGameDataRetrieved, isLoading, error, user } = useUserGameData();
  const [currMsg, setCurrMsg] = useState("");
  const dispatch = useDispatch();

  const { wsConnected } = useSelector((state: RootState) => state.websocket);
  const { messages, usersInRoom } = useSelector((state:RootState) => state.chat);

  useEffect(() => {
    dispatch(joinChatRoom());
  }, [dispatch]);
  if(!user && isUserGameDataRetrieved) return <div className="loading-overlay">Connecting to Chat...</div>
  if(!user) return <div className="loading-overlay">Loading...</div>

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
    return roomUser.id !== user!.id;
  });

  // useEffect(() => {
  //   if (!wsConnected || subscribed) return;
  //   dispatch(joinChatRoom());
  //   setSubscribed(true);
  // }, [user, wsConnected, subscribed, dispatch]);
  

  return (
    <div className="chat-room">
      { !user && isUserGameDataRetrieved && <div className="loading-overlay">Connecting to Chat...</div>}
      <div className="header centered">
        <div> ChatRoom</div>
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
      <div className="grid-right">Rules of game</div>
      <div className="bottom"></div>
    </div>
  );
};

export default ChatRoom;
