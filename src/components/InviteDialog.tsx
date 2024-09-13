import { useDispatch } from "react-redux";
import { respondToInvitation } from "../websocket/websocketActionCreators";
import ChatAvatar from "./ChatAvatar";

interface InviteDialogProps {
  recievedInvitations: Invitation[];
}
 
const InviteDialog: React.FC<InviteDialogProps> = ({recievedInvitations}) => {
  const dispatch = useDispatch();
  const onAccept = (invite: Invitation) => {dispatch(respondToInvitation(invite.id, true))  };
  const onDecline = (invite: Invitation) => {dispatch(respondToInvitation(invite.id, false))  };
  const msg = recievedInvitations.length === 1 ? "You have an invitation!" : "You have invitations!";
  return ( 
    <div className="invite-dialog">
      <h3>{msg}</h3>
      {recievedInvitations.map((invite) => (
        <div key={invite.id}>
         <ChatAvatar name={invite.inviter.name} showInviteButton={false}/>
         wants to play a game with you!
          <div>
            <button onClick={() => onAccept(invite)}>Accept</button>
            <button onClick={() => onDecline(invite)}>Decline</button>
          </div>
        </div>
      ))}
    </div>
   );
}
 
export default InviteDialog;