type HandleNewServerSnapshots = {
  type: "HANDLE_NEW_SERVER_SNAPSHOTS";
  payload: NewServerSnapshots;

}

 type NewServerSnapshots = {
  snapshots: GameSnapshot[];
  user: User;
  gameData: GameData;
  initial: boolean;
}