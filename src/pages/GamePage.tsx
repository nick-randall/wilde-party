import useUserGame from "../user/useUserGame";

interface GameProps {}

const Game: React.FC = () => {
  const { isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGame();

  return <div className="table-grid background-tile">
    
  </div>;
};

export default Game;
