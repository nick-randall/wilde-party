import LargeButton from "../components/LargeButton";
import useUserGameData from "../user/useUserGameData";
import { Table } from "./Table";
import { Center } from "../components/Center";

const Game: React.FC = () => {
  const {isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGameData();
  return (
    <div className="background-tile">
      {(error || !gameData) && isUserGameDataRetrieved && <UserGameErrors />}
      {(isLoading || !isUserGameDataRetrieved) && <Center>Loading...</Center>}
      {user && gameData && <Table gameData={gameData} />}
    </div>
  );
};

export default Game;

const UserGameErrors = () => {
  return (
    <Center>
      You aren't supposed to be in this game!
      <div style={{height: "10px"}}/>
       <LargeButton link="/" text="Start Over" />
    </Center>
  );
};
