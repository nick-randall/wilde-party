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