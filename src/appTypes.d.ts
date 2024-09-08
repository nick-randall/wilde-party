type User = {
  id: number;
  name: string;
};

type GameData = {
  id: number;
  players: PlayerDTO[];
  status: GameStatus;
};

type GameStatus = "created" | "started" | "finished" | "cancelled";
