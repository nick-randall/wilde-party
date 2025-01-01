type User = {
  id: number;
  name: string;
};

type GameData = {
  id: number;
  players: PlayerDTO[];
  status: GameStatus;
  initialSnapshot: GameSnapshot;
  // gameSnapshots: GameSnapshot[];
};

type GameStatus = "created" | "started" | "finished" | "cancelled";
