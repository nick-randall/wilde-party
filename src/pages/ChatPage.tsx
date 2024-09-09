import { useNavigate } from "react-router-dom";
import LargeButton from "../components/LargeButton";
import useUserGameData from "../user/useUserGameData";
import { Center } from "../components/Center";
import ChatRoom from "./ChatRoom";

const ChatPage: React.FC = () => {
  const {isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGameData();

  return (
    <div className="background-tile">
      {error && <Error error={error}/>}
      {(!user && isUserGameDataRetrieved) && <Error error="You need to create a user first!" />}
      {isLoading && <Center>Loading...</Center>}
      {/* {gameData && gameData.status === "created" && <GoToGame />}  */}
      {gameData && gameData.status === "started" && <ReturnToGame />}
      {user && <ChatRoom user={user} gameData={gameData} />}
    </div>
  );
};

export default ChatPage;

const ReturnToGame = () => {
  return (
    <Center>
      You already have a game underway!
      <LargeButton link="/game" text="Return to Game"></LargeButton>
    </Center>
  );
};

const Error = (props : {error: string}) => {
  const navigate = useNavigate();
  return (
    <Center>
      {props.error}
      <div style={{ height: "10px" }} />
      <LargeButton onClick={() => navigate("/")} text="Start Over"></LargeButton>
    </Center>
  );
};
