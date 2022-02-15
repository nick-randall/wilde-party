import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getIdListObject } from "./helperFunctions/getIdList";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { useEffect, useState } from "react";
import Player from "./Player";
import NonPlayerPlaces from "./NonPlayerPlaces";
import { dealInitialHands } from "./thunks/dealInitialCards";
import EnemyPlayer from "./EnemyPlayer";
import "./css/global.css";
import styled from "styled-components";

export const Table = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const screenSize = useSelector((state: RootState) => state.screenSize);
  const ids = getIdListObject(gameSnapshot);
  const { player, plays, draws, rolls, phase } = useSelector((state: RootState) => state.gameSnapshot.current);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });

  const onStart = () => {
    setGameStarted(true);
    setTimeout(() => {
      dispatch(dealInitialHands());
    }, 1800);
  };
  // useEffect(()=>{
  //   if(!gameStarted) {
  //     console.log("called it")
  //     dispatch(dealInitialHands());
  //   setGameStarted(true);
  //   }

  // }, [gameStarted, dispatch])
  interface GameStartedProps {
    gameStarted: boolean;
    onClick?: () => void;
    offsetTop?: number;
  }

  const SplashScreenButton = styled.div<GameStartedProps>`
    height: 80px;
    width: 400px;
    font-family: wilde-party-font;
    font-size: 30px;
    border-radius: 30px;
    box-shadow: 10px 10px 25px black;
    background-color: white;
    color: black;
    position: absolute;
    z-index: ${props => (props.gameStarted ? 0 : 100)};
    opacity: ${props => (props.gameStarted ? 0 : 1)};
    transform: translateX(-50%);
    top: ${props => (props.offsetTop ? props.offsetTop : "")}px;
  `;

  return (
    <div>
      <img
        src="./images/splashscreen.jpg"
        alt="background"
        style={{
          width: "100vw",
          opacity: gameStarted ? 0 : 1,
          transition: "1600ms",
          overflow: "hidden",
          padding: 0,
          zIndex: gameStarted ? 0 : 99,
          backgroundColor: "blue",
          position: "fixed",
        }}
      />
      <div style={{ display: "block", position: "absolute", top: "50vh", marginLeft: "50%", marginRight: "50%" }}>
        <SplashScreenButton gameStarted={gameStarted} onClick={onStart}>
          <div style={{ position: "relative", textAlign: "center", top: "50%", transform: "translateY(-50%)" }}>Spiel starten</div>
        </SplashScreenButton>
        <SplashScreenButton gameStarted={gameStarted} offsetTop={100}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              href="https://github.com/nick-randall/wilde-party"
              target="_self"
              style={{
                display: "flex",
                justifyContent: "center",
                verticalAlign: "middle",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <img src="https://www.analyticsvidhya.com/wp-content/uploads/2015/07/github_logo.png" alt="github logo" style={{ height: 40 }} />
            </a>
          </div>
        </SplashScreenButton>

        <DragDropContext
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
          onBeforeCapture={handleBeforeCapture}
        >
          <NonPlayerPlaces places={gameSnapshot.nonPlayerPlaces} screenSize={screenSize} />

          <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current={player === 0} />
          <EnemyPlayer id={gameSnapshot.players[1].id} screenSize={screenSize} places={gameSnapshot.players[1].places} current={player === 1} />
          <EnemyPlayer id={gameSnapshot.players[2].id} screenSize={screenSize} places={gameSnapshot.players[2].places} current={player === 2} />
          {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
        </DragDropContext>
      </div>
    </div>
  );
};
