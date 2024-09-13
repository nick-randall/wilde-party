import React from "react";
import styled from "styled-components";

interface ChatAvatarProps {
  name: string;
  showInviteButton?: boolean;
  onClick?: () => void;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ name, showInviteButton = true, onClick }) => {
  return (
    // <div style={{ display: "flex",  alignItems: "end", justifyContent: "space-around" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <img
        onClick={onClick}
        style={{ maxWidth: 80, cursor: onClick ? "pointer" : "default" }}
        src="https://png.pngtree.com/png-vector/20220618/ourmid/pngtree-bald-man-avatar-illustration-user-png-image_5209160.png"
        alt="avatar"
      />
      <div>{name}</div>
      <div style={{ height: 10 }} />
      {showInviteButton && onClick !== undefined && (
       <InviteButton onClick={onClick}/>
      )}
    </div>
  );
};

export default ChatAvatar;

const Button = styled.div`
  backgroundcolor: transparent;
  fontsize: 12;
  color: yellow;
  borderradius: 8;
  padding: 6;
  cursor: pointer;
`;

const InviteButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return <button onClick={onClick} style={{backgroundColor: "black"}}><Button> Invite to a Game</Button> </button>;
}
