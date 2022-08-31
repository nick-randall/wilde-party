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

  type WidgetData = {
    index: number;
    atFinalIndex?: boolean;
    widgetComponent: JSX.Element;
  };
  
  type InnerWidgetProps = {
    setupData: JoinGameParams;
    setSetupData: React.Dispatch<React.SetStateAction<JoinGameParams>>;
    submit: (atFinalIndex?: boolean) => void;
    atFinalIndex?: boolean;
  };


type WidgetProps = WidgetData & {
  children: JSX.Element;
  currIndex: number;
};
  