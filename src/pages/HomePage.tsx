import "../css/global.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, endGame, justCreateDemoGame, logout } from "../user/userSlice";
import useUserGameData from "../user/useUserGameData";
import LargeButton from "../components/LargeButton";
import TextInput from "../components/TextInput";
import SmallButton from "../components/SmallButton";
import { testCardRow } from "../gameComponents/NewGCZ";

const HomePage: React.FC = () => {
  testCardRow()
  const { isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGameData();
  return (
    <div className="splash-screen flex-column">
      <div style={{ height: "20vh" }} />
      {error && <ErrorMessage error={error} />}
      {isLoading && <Loading />}
      {isUserGameDataRetrieved && !user && <EnterName />}
      {user && !gameData && <UserGreetings user={user} />}
      {gameData && <ReturnToGame />}
    </div>
  );
};

const ErrorMessage = (props: { error: string }) => {
  const dispatch = useDispatch();
  const handleClick = () => dispatch(logout());
  return (
    <div>
      {props.error}
      <div style={{ height: "20px" }} />
      <LargeButton onClick={handleClick} text="Start Over" />
    </div>
  );
};

const Loading = () => <div>Loading...</div>;

const UserGreetings = (props: { user: User }) => {
  const dispatch = useDispatch();
  return (
    <div style={{ color: "black", textShadow: "none" }}>
      Welcome, {props.user.name}!
      <div style={{ height: "20px" }} />
      <LargeButton link={`/chat`} text="Start Game" />
      <SmallButton onClick={() => dispatch(justCreateDemoGame())} text="Create Demo Game" />
    </div>
  );
};

const EnterName = () => {
  const [newUserName, setNewUserName] = useState("");
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setNewUserName(e.target.value)
    setError("");
  }

  const handleClick = () => {
    if(!newUserName) { 
      setError("Please enter a name");
      return;
    }
    if (clicked) return;
    setClicked(true);
    dispatch(addUser(newUserName));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClick();
  };
  const dispatch = useDispatch();

  return (
    <>
      <form onSubmit={handleSubmit}>
        Enter your name:
        <div style={{ height: "20px" }} />
        <TextInput name="username" value={newUserName} onChange={handleChange} />
        <div style={{ height: "10px" }} />
        <SmallButton onClick={handleClick} text="OK" />
        {error && <div className="error-text">{error}</div>}
      </form>
      <SmallButton onClick={() => dispatch(justCreateDemoGame())} text="Create Demo Game" />
  </>

  );
};

const ReturnToGame: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      You already have an active game!
      <div style={{ height: "20px" }} />
      <LargeButton link={"/game"} text="Return to game" />
      <div style={{ height: "10px" }} />
      <SmallButton text="End game" onClick={() => dispatch(endGame())}/>
    </div>
  );
};

export default HomePage;
