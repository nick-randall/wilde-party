import React from "react";

interface ChatMessageProps {
  msg: ChatMessage;
  onClick: () => void;
  me: User;
}

const ChatMessageText: React.FC<ChatMessageProps> = ({ msg, onClick, me }) => {
  if (msg.type === "join") {
    return (
      <div style={{ textAlign: "left" }}>
        <span style={{ color: "black", textDecoration: "none" }}>{msg.sender.name} has joined the chat! </span>

        {me.id !== msg.sender.id && (
          <span style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer", fontSize: 13 }} onClick={onClick}>
            Invite {msg.sender.name} to a game
          </span>
        )}
      </div>
    );
  } else if (msg.type === "chat") {
    return (
      <div style={{ textAlign: "left" }}>
        {msg.sender.name}: {msg.content}
      </div>
    );
  }
  return <div style={{ textAlign: "left" }}>{msg.content}</div>;
};

export default ChatMessageText;
