type SnapshotUpdateData = {
  type: SnapshotUpdateType;
  playedCardIds: number[]; // plural needed for dealt cards, as well as CardGroup rearrange
  targetId: number; // can be playerId, placeId, or cardId
  secondaryCardId?: number; // necessary for swap
};

type CardActionResult = {
  isLegalTarget: boolean;
  resultingGameSnapshot: GameSnapshot;
  targetType: LegalTargetType;
  actionType: ActionType;
};

type CardActionResultsMap = {
  [cardId: number]: CardActionResult;
};

type ChatMessage = {
  type: MessageType;
  content: string;
  sender: User;
};

type GameSnapshotUpdates = {
  type: string;
  gameSnapshots: GameSnapshot[];
};

type PlayerDTO = {
  id: number;
  name: string;
  isHuman: boolean;
};

type OutgoingInvitationMessage = {
  type: ChatRoomUpdateType;
  inviteeId?: number;
  invitationId?: number;
};

//TODO rename to ChatRoomDataUpdate

type ChatRoomDataUpdate = {
  type: ChatRoomUpdateType;
  message: string;
  sentInvitations: Invitation[];
  receivedInvitations: Invitation[];
  gameData? : GameData;
};

type Invitation = {
  id: number;
  inviter: User;
  invitee: User;
};

type ChatRoomUpdateType = "update" | "invite" | "accept" | "decline";

type MessageType = "chat" | "join" | "leave" | "starting_game";
