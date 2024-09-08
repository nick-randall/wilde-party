import { useNavigate } from "react-router-dom";
import LargeButton from "../components/LargeButton";
import useUserGameData from "../user/useUserGameData";
import { Center } from "../components/Center";
import ChatRoom from "./ChatRoom";

const ChatPage: React.FC = () => {
  const { isLoading, error, user, gameData } = useUserGameData();
  return (
    <div className="background-tile">
      {(error || !user) && <Error />}
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

const Error = () => {
  const navigate = useNavigate();
  return (
    <Center>
      You need to create a user first!
      <div style={{ height: "10px" }} />
      <LargeButton onClick={() => navigate("/")} text="Start Over"></LargeButton>
    </Center>
  );
};
