import styled from "styled-components";
import "animate.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { HorizontalFlyButton } from "./HorizontalFlyButton";
import ReactFlipMove from "react-flip-move";
import FlipMove from "react-flip-move";
import JoinGameButton from "./JoinButton";

type Choice = "createNewGame" | "joinGame" | "";

const host = "127.0.0.1";
const port = 8443;

const HomePage: React.FC = () => {
  const [bannerOffScreen, setBannerOffScreen] = useState(false);
  const [choice, setChoice] = useState<Choice>("");
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | undefined>();
  const [availableGames, setAvailableGames] = useState<AvailableGame[]>();

  const slideBanner = () => setBannerOffScreen(state => !state);
  const chooseCreateNewGame = () => {
    setChoice("createNewGame");
    createNewGame();
  };
  const chooseJoinGame = () => {
    const ws = new WebSocket(`wss://${host}:${port}/Wilde_Party/waiting-games-stream`);
    ws.onmessage = (message: MessageEvent) => {
      console.log(message.data);
      setAvailableGames(JSON.parse(message.data));
    };
  };
  useEffect(() => {
    if (availableGames !== undefined) {
      setChoice("joinGame");
    }
  }, [availableGames]);

  const signInAnonymously = useCallback(() => {
    axios.get(`https://${host}:${port}/Wilde_Party/get-session-token`).then(response => {
      console.log(response.headers.sessiontoken);
      setSessionToken(response.headers.sessiontoken);
      window.localStorage.setItem("sessiontoken", response.headers.sessiontoken);
    });
  }, []);

  const createNewGame = useCallback(() => {
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
        .get(`https://127.0.0.1:8443/Wilde_Party/join-game/?partyaddress=${partyStreetNumber}`, {
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
            <HorizontalFlyButton offScreen={choice === "joinGame" ? "top" : ""} disabled={choice !== ""} onClick={chooseCreateNewGame}>
              Neue Party starten
            </HorizontalFlyButton>

            <div className={`horizontal-flex-container`}>
              {availableGames && ( // TODO should be .length
                <FlipMove
                  duration={1000}
                  // leaveAnimation={{ from: { height: "0px" }, to: { height: "100px" } }}
                  // enterAnimation={{ from: { height: "0px" }, to: { height: "100px" }  }}
                >
                  {availableGames.map(game => (
                    <JoinGameButton key={game.id} offScreen={choice !== "joinGame"} joinGame={() => joinGame(game.partyAddress)}>
                      {game.partyAddress}
                    </JoinGameButton>
                    // <p>{game.partyAddress}</p>
                  ))}
                </FlipMove>
              )}
            </div>
          </div>

          <div className={`vertical-container justify-content-start`}>
            <HorizontalFlyButton offScreen={choice === "createNewGame" ? "bottom" : ""} disabled={choice !== ""} onClick={chooseJoinGame}>
              Zur Party einer Freund*in
            </HorizontalFlyButton>
          </div>
        </div>
      </div>

      <div
        className={`banner full-height ${bannerOffScreen ? "off-screen" : ""}`}
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
          <HorizontalFlyButton
            throb
            // className={!bannerOffScreen ? "animate__animated animate__pulse animate__infinite" : ""}
            offScreen=""
            onClick={slideBanner}
          >
            starten
          </HorizontalFlyButton>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
