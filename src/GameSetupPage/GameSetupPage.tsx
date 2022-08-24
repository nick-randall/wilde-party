import { FC, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CreateGamePage from "./CreateGamePage";
import JoinGamePage from "./JoinGamePage";
import { WidgetData, ActiveGames, TextInput, WaitingWidget } from "./GameSetupWidgets";
import AuthRoute from "./AuthRoute";

interface GameSetupProps {}

const GameSetup: FC<GameSetupProps> = () => {
  const location = useLocation();

  return (
    <AuthRoute checkForActiveGames>
      <div style={{ display: "grid", gridTemplateColumns: 4, gridTemplateRows: 8, justifyContent: "center", height: "100%" }}>
        <Link to="/game/setup/createGame" style={{ gridColumn: 2, gridRow: 3 }}>
          <div className={`button  ${location.pathname === "/game/setup/joinGame" ? "offscreen-top" : ""}`}>Neue Party starten</div>
        </Link>
        <Link to="/game/setup/joinGame" style={{ gridColumn: 2, gridRow: 4 }}>
          <div className={`button  ${location.pathname === "/game/setup/createGame" ? "offscreen-bottom" : ""}`}>zur Party einer Freund*in</div>
        </Link>

        <Routes>
          <Route path="/joinGame/*" element={<JoinGamePage />} />
          <Route path="/createGame/*" element={<CreateGamePage />} />
        </Routes>
      </div>
    </AuthRoute>
  );
};

export default GameSetup;
