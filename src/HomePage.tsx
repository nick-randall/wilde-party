import { url } from "inspector";
import { Link } from "react-router-dom";
import styled, { StyledComponent } from "styled-components";
import "./css/global.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser, logout, whoami } from "./user/userSlice";
import { END_DRAG_CLEANUP, SET_DRAGGED_HAND_CARD } from "./redux/dragEventReducer";
import useUserGame from "./user/useUserGame";

type GameStartedProps = {
  imageHeight?: number;
};

const HomeScreenButton = styled.div<GameStartedProps>`
  height: 40px;
  width: 300px;
  font-family: wilde-party-font;
  font-size: 35px;
  border-radius: 30px;
  box-shadow: 4px 5px 0px black;
  background-color: white;
  color: #f9ca44;
  border: thin black solid;
  padding: ${props => (props.imageHeight ? "12.5px 15px 12.5px 15px" : "20px 15px 10px 15px")};
  text-align: center;
  display: inline-block;
  /*text-shadow: 4px 5px 0px black;*/
`;

const HomeScreenButtonWithListener = styled.button<GameStartedProps>`
  height: 40px;
  width: 300px;
  font-family: wilde-party-font;
  font-size: 35px;
  border-radius: 30px;
  box-shadow: 4px 5px 0px black;
  background-color: white;
  color: #f9ca44;
  border: thin black solid;
  padding: ${props => (props.imageHeight ? "12.5px 15px 12.5px 15px" : "20px 15px 10px 15px")};
  text-align: center;
  display: inline-block;
  /*text-shadow: 4px 5px 0px black;*/
`;

const HomePage: React.FC = () => {
  const { isUserGameDataRetrieved, isLoading, error, user, gameData } = useUserGame();
  const [newUserName, setNewUserName] = useState("");
  //   if (userLoading || !user) {
  //     return (
  //       <CenterContent>
  //         <div>Loading...</div>
  //       </CenterContent>
  //     );
  //   }

  //   if (!user) return <div>loading...</div>;

  //   return <ChatRoom user={user} />;
  // }
  const dispatch = useDispatch();
  return (
    <div className="splash-screen">
      {/* <img
        src="./images/splashscreen.jpg"
        alt="background"
        style={{
          width: "100vw",
          transition: "1600ms",
          overflow: "hidden",
          padding: 0,
          position: "fixed",
          backgroundRepeat: "repeat"
        }}
      />  */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          backgroundImage: `url("./images/splashscreen.jpg")`,
          backgroundSize: "cover",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: "65vh" }} />
          {error && (
            <div>
              {error}
              <br /> <button onClick={() => dispatch(logout())}>Start over</button>
            </div>
          )}
          {isLoading && <div>Loading...</div>}
          {isUserGameDataRetrieved && !user && (
            <div>
              <label htmlFor="username">
                Enter your name:
                <br />
                <input name="username" value={newUserName} onChange={v => setNewUserName(v.target.value)} />
              </label>
              <button onClick={() => dispatch(addUser(newUserName))}>OK</button>
            </div>
          )}
          {user && !gameData && (
            <div>
              Welcome {user.name}!
              <br />
              <Link to="/chat">
                <HomeScreenButton>Start</HomeScreenButton>
              </Link>
            </div>
          )} {
            gameData && ( 
              <div>
                <Link to="/game">
                  <HomeScreenButton>Spiel fortsetzen</HomeScreenButton>
                </Link>
              </div>
            )
          }
          <div style={{ height: 10 }} />
          <HomeScreenButton imageHeight={30}>
            <a href="https://github.com/nick-randall/wilde-party" target="_self">
              <img src="https://www.analyticsvidhya.com/wp-content/uploads/2015/07/github_logo.png" alt="github logo" style={{ height: 35 }} />
            </a>
          </HomeScreenButton>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default HomePage;
