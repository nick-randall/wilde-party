import { url } from "inspector";
import { Link } from "react-router-dom";
import styled, { StyledComponent } from "styled-components";
import "animate.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

type GameStartedProps = {
  imageHeight?: number;
  wide?: boolean;
  disabled?: boolean;
};

type Choice = "createNewGame" | "joinGame" | "";

const HomeScreenButton = styled.div<GameStartedProps>`
  // height: 40px;
  width: ${props => (props.wide ? "30ch" : "15ch")};
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
  cursor: ${props => (props.disabled ? "auto" : "pointer")};
  /*text-shadow: 4px 5px 0px black;*/
`;

const HomePage: React.FC = () => {
  const [bannerOffScreen, setBannerOffScreen] = useState(false);
  const [choice, setChoice] = useState<Choice>("");
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | undefined>();

  const slideBanner = () => setBannerOffScreen(state => !state);
  const chooseCreateNewGame = () => {
    setChoice("createNewGame");
    // createNewGame()
  };
  const chooseJoinGame = () => {
    setChoice("joinGame");
    // joinGame("Wilde-Kirsche-Strasse40");
  };

  const signInAnonymously = useCallback(() => {
    const host = "127.0.0.1";
    const port = 8443;
    axios.get(`https://${host}:${port}/Wilde_Party/get-session-token`).then(response => {
      console.log(response.headers.sessiontoken);
      setSessionToken(response.headers.sessiontoken);
      window.localStorage.setItem("sessiontoken", response.headers.sessiontoken);
    });
  }, []);

  const createNewGame = useCallback(() => {
    const host = "127.0.0.1";
    const port = 8443;
    axios
      .get(`https://${host}:${port}/Wilde_Party/create-game`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(`Error creating a game: ${error}`);
        console.log(error.response.status);
        console.log(error.response);
        if (error.response.status === 401) {
          console.log(error.response);
          setSessionToken("");
          // localStorage.setItem("sessiontoken", undefined);
        } else if (error.response.data.reason === "gameAlreadyInProgress") {
          console.log("game is already in progress!");
        }
      })
      .finally(() => {});
  }, [sessionToken]);

  const joinGame = useCallback(
    (partyStreetNumber: string) => {
      axios
        .get(`https://127.0.0.1:8443/Wilde_Party/join-game/?partyaddress=Wilde-Kirsche-Strasse-805405`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        })
        .then(response => console.log(response))
        .catch(error => {
          console.log(error.response);
          if (error.response.status === 401) {
            setSessionToken("");
            // localStorage.setItem("sessiontoken", undefined);
          }
        });
    },
    [sessionToken]
  );

  useEffect(() => {
    signInAnonymously();
  }, [signInAnonymously]);

  return (
    <div className="full-height">
      <div className="screen-behind full-height">
        <div className="vertical-container">
          <div className={`vertical-container justify-content-end`}>

            <HomeScreenButton
              className={`flying-button ${choice === "joinGame" ? "off-screen-top" : ""}`}
              disabled={choice !== ""}
              onClick={chooseCreateNewGame}
            >
              Neue Party starten
            </HomeScreenButton>
          </div>

          <div className={`vertical-container justify-content-start`}>
          <HomeScreenButton
            className={`flying-button ${choice === "createNewGame" ? "off-screen-bottom" : ""}`}
            disabled={choice !== ""}
            onClick={chooseJoinGame}
          >
            Zur Party einer Freund*in
          </HomeScreenButton>
          </div>
        </div>
      </div>

      <div
        className={`banner horizontal-flex-container full-height ${bannerOffScreen ? "off-screen" : ""}`}
        style={
          {
            // position: "relative",
            // display: "flex",
            // justifyContent: "center",
            // backgroundImage: `url("./images/splashscreen.jpg")`,
            // backgroundSize: "cover",
            // transition: "3s",
          }
        }
      >
        <div className="vertical-container">
          <div style={{ height: "10vh" }} />
          <HomeScreenButton className={!bannerOffScreen ? "animate__animated animate__pulse animate__infinite" : ""} onClick={slideBanner}>
            starten
          </HomeScreenButton>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
