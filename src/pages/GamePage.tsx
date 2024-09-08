import { useNavigate } from "react-router-dom";
import WildePartyButton from "../components/WildePartyButton";
import useUserGameData from "../user/useUserGameData";
import { Table } from "./Table";
import { Center } from "../components/Center";

const Game: React.FC = () => {
  const { isLoading, error, user, gameData } = useUserGameData();
  return (
    <div className="background-tile">
      {(error || !gameData) && <UserGameErrors />}
      {isLoading && <Center>Loading...</Center>}
      {user && gameData && <Table gameData={gameData} />}
    </div>
  );
};

export default Game;

const UserGameErrors = () => {
  const navigate = useNavigate();
  return (
    <Center>
      You aren't supposed to be in this game!
       <WildePartyButton onClick={() => navigate("/")} text="Start Over"></WildePartyButton>
    </Center>
  );
};
