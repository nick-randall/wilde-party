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

  type JoinGameParams = {
    partyAddress: string;
    playerName: string;
  }

  type JoinGameSuccessMessage = {
    type: "joinedGame";
    message: string;
    gameStats: GameStats;
    websocketToken: string;
  };
  
  type JoinGameErrorMessage = {
    type: "joinedGame";
    message: string;
    partyAddress: string;
    websocketToken: string;
  };

  type CheckSessionTokenSuccessMessage = {
    type: string;
    message: string;
    activeGame: GameStats;
  }
  