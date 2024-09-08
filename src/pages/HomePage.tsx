import "../css/global.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, logout } from "../user/userSlice";
import useUserGameData from "../user/useUserGameData";
import WildePartyButton from "../components/WildePartyButton";

const HomePage: React.FC = () => {
  const { isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGameData();

  return (
    <div className="splash-screen flex-column">
      <div style={{ height: "20vh" }} />
      {error && <ErrorMessage error={error} />}
      {isLoading && <Loading />}
      {isUserGameDataRetrieved && !user && <EnterName />}
      {user && !gameData && <UserGreetings user={user} />}
      {gameData && <WildePartyButton link="/game" text="Return to game" />}
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
      <WildePartyButton onClick={handleClick} text="Start Over" />
    </div>
  );
};

const Loading = () => <div>Loading...</div>;

const UserGreetings = (props: { user: User }) => {
  return (
    <>
      Welcome, {props.user.name}!
      <div style={{ height: "20px" }} />
      <WildePartyButton link="/chat" text="Start Game" />
    </>
  );
};

const EnterName = () => {
  const [newUserName, setNewUserName] = useState("");
  const handleClick = () => dispatch(addUser(newUserName));
  const dispatch = useDispatch();
  return (
    <div>
      <label htmlFor="username">
        Enter your name:
        <br />
        <input name="username" value={newUserName} onChange={v => setNewUserName(v.target.value)} />
      </label>
      <button onClick={handleClick}>OK</button>
    </div>
  );
};

export default HomePage;
