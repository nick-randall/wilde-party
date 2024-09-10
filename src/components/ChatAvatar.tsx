interface ChatAvatarProps { 
  name: string;
  isMe?: boolean;
  onClick?: () => void;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ name, isMe=false, onClick }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <img
        onClick={onClick}
        style={{ maxWidth: 80, cursor: onClick ? "pointer" : "default" }}
        src="https://png.pngtree.com/png-vector/20220618/ourmid/pngtree-bald-man-avatar-illustration-user-png-image_5209160.png"
        alt="avatar"
      />
      <div style={{backgroundColor: isMe ? "yellow": "white"}}>{name}</div>
    </div>
  );
};

export default ChatAvatar;