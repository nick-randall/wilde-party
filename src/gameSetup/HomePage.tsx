import styled from "styled-components";
import "animate.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { HorizontalFlyButton } from "./HorizontalFlyButton";

type Choice = "createNewGame" | "joinGame" | "";

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
            <HorizontalFlyButton offScreen={choice === "joinGame" ? "top" : ""} disabled={choice !== ""} onClick={chooseCreateNewGame}>
              Neue Party starten
            </HorizontalFlyButton>
            <input type="text" className={`test flying-button ${choice === "createNewGame" || choice === "" ? "off-screen-top" : ""}`} />
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
