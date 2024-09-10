import "../css/global.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, logout } from "../user/userSlice";
import useUserGameData from "../user/useUserGameData";
import LargeButton from "../components/LargeButton";
import TextInput from "../components/TextInput";
import SmallButton from "../components/SmallButton";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const { isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGameData();
  const navigate  = useNavigate();
  return (
    <div className="splash-screen flex-column">
      <div style={{ height: "20vh" }} />
      {error && <ErrorMessage error={error} />}
      {isLoading && <Loading />}
      {isUserGameDataRetrieved && !user && <EnterName />}
      {user && !gameData && <UserGreetings user={user} />}
      {gameData && <LargeButton onClick={()=> navigate("/chat")} text="Return to game" />}
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
  return (
    <div style={{color: "black", textShadow :"none"}}>
      Welcome, {props.user.name}!
      <div style={{ height: "20px" }} />
      <LargeButton link={`/chat`} text="Start Game" />
    </div>
  );
};

const EnterName = () => {
  const [newUserName, setNewUserName] = useState("");
  const handleClick = () => dispatch(addUser(newUserName));
  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault();
    handleClick();
  }
  const dispatch = useDispatch();
  return (
    <form onSubmit={handleSubmit}>
      Enter your name:
      <div style={{ height: "20px" }} />
      <TextInput name="username" value={newUserName} onChange={v => setNewUserName(v.target.value)} />
      <div style={{ height: "10px" }} />
      <SmallButton onClick={handleClick} text="OK"/>
    </form>
  );
};

export default HomePage;
