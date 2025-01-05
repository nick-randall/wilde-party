import LargeButton from "../components/LargeButton";
import useUserGameData from "../user/useUserGameData";
import { Table } from "./Table";
import { Center } from "../components/Center";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setInitialSnapshot } from "../gameSnapshotState/gameSnapshotSlice";
import { setMyIndex } from "../user/userSlice";

const Game: React.FC = () => {
  const { isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGameData();

  // Ensure that the initial snapshot is set in the gameSnapshotState
  const dispatch = useDispatch();
  const { snapshots, currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  if (gameData?.initialSnapshot && user && snapshots.length === 0) {
    const myIndex = gameData.players.findIndex((p) => p.id === user.id);
    dispatch(setMyIndex(myIndex));
    dispatch(setInitialSnapshot(gameData.initialSnapshot));
  }


  
  return (
    <div className="background-tile">
      {error && <UserGameErrors />}
      {!error && (isLoading || !isUserGameDataRetrieved) && <Center>Loading...</Center>}
      {user && gameData && currSnapshot.index > -1 && <Table gameData={gameData} user={user}  />}
    </div>
  );
};

export default Game;

const UserGameErrors = () => {
  return (
    <Center>
      You aren't supposed to be in this game!
      <div style={{ height: "10px" }} />
      <LargeButton link="/" text="Start Over" />
    </Center>
  );
};
