import React, { useEffect, useState } from "react";
import { connectWebsocket, inviteUserToGame, joinChatRoom, sendMessageToRoom } from "../websocket/websocketActionCreators";
import { useSelector, useDispatch } from "react-redux";
import ChatAvatar from "../components/ChatAvatar";
import { RootState } from "../redux/store";
import ChatMessageText from "../components/ChatMessage";
import { Center } from "../components/Center";
import LargeButton from "../components/LargeButton";
import "../css/chat-room.css";
import InviteDialog from "../components/InviteDialog";
import SendIcon from "../components/SendIcon";

interface ChatRoomProps {
  user: User;
  gameData?: GameData;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user, gameData }) => {
  const dispatch = useDispatch();

  const { wsConnected, wsLoading, wsError } = useSelector((state: RootState) => state.websocket);
  const { messages, usersInRoom, sentInvitations, receivedInvitations, gameData: gameDataFromChat } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (!wsConnected && !wsLoading && !wsError) {
      dispatch(connectWebsocket({ actionOnConnect: joinChatRoom() }));
    }
  }, [dispatch, wsConnected, wsError, wsLoading]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     dispatch({ type: "INVITE_USER_TO_GAME", payload: { inviteeId: 1 } });
  //     // dispatch({ type: "SEND_MESSAGE_TO_ROOM", payload: { inviteeId: 1 } });

  //   }, 1000);
  // },[]);
  if (gameData) console.log(gameData);
  if (gameDataFromChat) console.log(gameDataFromChat);
  return (
    <>
      {receivedInvitations.length > 0 && <InviteDialog recievedInvitations={receivedInvitations} />}
      {!wsConnected && <LostConnection  />}
      {wsError && <ConnectionError error={wsError}/>}
      {wsLoading && <div className="loading-overlay">Connecting to Chat...</div>}
      {gameData && <GoToGame user={user} gameData={gameData} alreadyStarted={false} />}
      {gameDataFromChat && <GoToGame user={user} gameData={gameDataFromChat} alreadyStarted={true} />}
      <ChatRoomLayout user={user} messages={messages} usersInRoom={usersInRoom} sentInvitations={sentInvitations} />
    </>
  );
};

const ChatRoomLayout: React.FC<{
  user: User;
  messages: ChatMessage[];
  usersInRoom: User[];
  sentInvitations: Invitation[];
}> = ({ user, messages, usersInRoom, sentInvitations }) => {
  const [currMsg, setCurrMsg] = useState("");
  const dispatch = useDispatch();
  const usersInRoomWithoutSelf = usersInRoom.filter(roomUser => {
    console.log(roomUser);
    return roomUser.id !== user.id;
  });
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
  return (
    <div className="chat-room">
      <div className="header"> Chat Room</div>

      <div className="grid-left" style={{ display: "wrap" }}>
        <ChatAvatar name={user!.name} showInviteButton={false} />

        {usersInRoomWithoutSelf.map((roomUser, i) => {
          return (
            <ChatAvatar
              key={i + "avatar"}
              name={roomUser.name}
              onClick={() => inviteUser(roomUser)}
              showInviteButton={!sentInvitations.some(invite => invite.invitee.id === roomUser.id)}
            />
          );
        })}
      </div>
      <div className="chat-window grid-center">
        {messages.map((msg, i) => (
          <ChatMessageText msg={msg} onClick={() => inviteUser(msg.sender)} me={user!} key={`message-${i}`} />
        ))}
        <form onSubmit={handleSendMessage}></form>
        <div className="chat-input-row">
          <input value={currMsg} onChange={handleChatInputChange} />
          {/* <img src="./icons/send.svg" alt="send" onClick={handleSendMessage} className="send-button" /> */}
        <SendIcon onClick={handleSendMessage} />
        </div>
      </div>
      <div className="grid-right">Rules of the game</div>
      <div className="bottom">
        {sentInvitations.map(invite => (
          <>Pending: You invited {invite.invitee.name} to a game</>
        ))}
      </div>
    </div>
  );
};

const LostConnection: React.FC = () => {
  const dispatch = useDispatch();

  const reconnect = () => {
    dispatch(connectWebsocket({ actionOnConnect: joinChatRoom() }));
  };
  return (
    <div className="loading-overlay">
      <Center>
     
        Lost connection to chat...
        <div style={{ height: 10 }} />
        <LargeButton text="Re-connect" onClick={reconnect} />
      </Center>
    </div>
  );
};

const ConnectionError: React.FC<{error: string}> = ({error}) => {
  return (
    <div className="loading-overlay">
      <Center>
      Error: {error}
        <div style={{ height: 10 }} />
        <LargeButton text="Start Over" link="/" />
      </Center>
    </div>
  );
};

const GoToGame: React.FC<{ user: User; gameData: GameData; alreadyStarted: boolean }> = ({ user, gameData, alreadyStarted }) => {
  const otherHumanPlayer = gameData.players.find(player => player.id !== user.id && player.isHuman);
  return (
    <Center>
      Your game with {otherHumanPlayer?.name} is ready to begin!
      <LargeButton link="/game" text="Go to Game"></LargeButton>
    </Center>
  );
};

export default ChatRoom;
