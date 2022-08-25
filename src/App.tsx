import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import Game from "./GamePath";
import "./css/global.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import { host, port } from "./api/useApi";
import { checkSessionToken, signInAnonymously } from "./api/api";
import SessionProvider, { SessionContext } from "./SessionProvider";

/**
 * By nesting the app inside a router, we get the location object
 */
interface AppProps {}

const App: FC<AppProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionToken, login, logout, verifyToken, activeGame } = useContext(SessionContext);

  const signInAndLaunch = async () => {
    login().then((sessionToken: string) => {
      console.log(sessionToken);
      navigate("game/setup");
    });
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("sessiontoken");
    if (savedToken) {
      console.log("verifying token " + savedToken);
      verifyToken(savedToken);
      console.log("finished?");
    }
  }, [verifyToken]);

  return (
    <>
      <div className={`banner ${location.pathname === "/" ? "" : "off-screen"}`}>
        {/* {error && <div>{error}</div>} */}
        {sessionToken == null ? "NULL": sessionToken}
        {sessionToken && (
          <div className={`button pulsing`}>
            <Link to="/game/setup">{activeGame ? "zurück zum Spiel" : "starten"}</Link>
          </div>
        )}
        {!sessionToken && (
          <div className="button" onClick={signInAndLaunch}>
            starten
          </div>
        )}
        {sessionToken}
      </div>
      <Routes>
        <Route path="/game/*" element={<Game />} />
      </Routes>
    </>
  );
};

export default App;
