type GameStats = {
  partyAddress: string;
  partyName: string;
  totalPlayers: string;
  players: GamePlayer[];
  status: GameStatus;
  id: string;
};

type GameStatus =  
  "awaitingPlayers" | "underway" | "completed"
