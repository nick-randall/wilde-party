import { FC } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link } from "react-router-dom";
import CreateGamePage from "./CreateGamePage";
import JoinGamePage from "./JoinGamePage";
import SessionRoute from "./SessionRoute";
import "./GameSetupPages.css";

interface GameSetupProps {}

const GameSetup: FC<GameSetupProps> = () => {
  const location = useLocation();

  const joinGameButtonStyles: { [pathname: string]: string } = {
    "/game/setup/createGame": "offscreen-top",
    "/game/setup": "clickable",
    "/game/setup/joinGame": "raised-left plain",
  };
  const createGameButtonStyles: { [pathname: string]: string } = {
    "/game/setup/createGame": "raised-right plain",
    "/game/setup": "clickable",
    "/game/setup/joinGame": "offscreen-top",
  };

  console.log(createGameButtonStyles[location.pathname]);

  return (
    <SessionRoute checkForActiveGames>
      <>
        <Routes>
          <Route path="/joinGame/*" element={<JoinGamePage />} />
          <Route path="/createGame/*" element={<CreateGamePage />} />
        </Routes>
        <div style={{ display: "flex", justifyContent: "center", gap: "3ch" }}>
          <Link to="/game/setup/createGame">
            <div style={{ top: "20vh" }} className={`button ${createGameButtonStyles[location.pathname]}`}>
              Neue Party starten
            </div>
          </Link>
          <Link to="/game/setup/joinGame">
            <div style={{ top: "20vh" }} className={`button ${joinGameButtonStyles[location.pathname]}`}>
              zur Party einer Freund*in
            </div>
          </Link>
        </div>
      </>
    </SessionRoute>
  );
};

export default GameSetup;
