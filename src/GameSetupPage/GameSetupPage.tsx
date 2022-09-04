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

  const joinGameButtonPosition: { [pathname: string]: string } = {
    "/game/setup/createGame": "offscreen-bottom",
    "/game/setup": "",
    "/game/setup/joinGame": "lowered",
  };
  const createGameButtonPosition: { [pathname: string]: string } = {
    "/game/setup/createGame": "raised",
    "/game/setup": "",
    "/game/setup/joinGame": "offscreen-top",
  };

  console.log(createGameButtonPosition[location.pathname]);

  return (
    <SessionRoute checkForActiveGames>
      <>
        <Routes>
          <Route path="/joinGame/*" element={<JoinGamePage />} />
          <Route path="/createGame/*" element={<CreateGamePage />} />
        </Routes>
        <Link to="/game/setup/createGame">
          <div style={{ top: "30%" }} className={`button ${createGameButtonPosition[location.pathname]}`}>
            Neue Party starten
          </div>
        </Link>
        <Link to="/game/setup/joinGame">
          <div style={{ bottom: "30%" }} className={`button ${joinGameButtonPosition[location.pathname]}`}>
            zur Party einer Freund*in
          </div>
        </Link>
      </>
    </SessionRoute>
  );
};

export default GameSetup;
