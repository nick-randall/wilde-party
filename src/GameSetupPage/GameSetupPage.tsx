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

  return (
    <SessionRoute checkForActiveGames>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ height: "100%", position: "relative" }}>
          <Routes>
            <Route path="/joinGame/*" element={<JoinGamePage />} />
          </Routes>
          <Link to="/game/setup/createGame">
            <div
              style={{ bottom: "5%" }}
              className={`button ${location.pathname !== "/game/setup/createGame" && location.pathname !== "/game/setup" ? "offscreen-top" : ""}`}
            >
              Neue Party starten
            </div>
          </Link>
        </div>
        <div style={{ height: "100%", position: "relative" }}>
          <Link to="/game/setup/joinGame">
            <div
              style={{ top: "5%" }}
              className={`button ${location.pathname !== "/game/setup/joinGame" && location.pathname !== "/game/setup" ? "offscreen-bottom" : ""}`}
            >
              zur Party einer Freund*in
            </div>
          </Link>
          <Routes>
            <Route path="/createGame/*" element={<CreateGamePage />} />
          </Routes>
        </div>

        {/* <Routes> */}
        {/* <Route path="/joinGame/*" element={<JoinGamePage />} /> */}

        {/* </Routes> */}
      </div>
    </SessionRoute>
  );
};

export default GameSetup;
