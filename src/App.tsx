import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import Game from "./GamePath";
import "./css/global.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import { host, port } from "./api/useApi";
import { checkSessionToken, signInAnonymously } from "./api/api";
import SessionProvider, { ErrorMessage, SessionContext } from "./SessionProvider";

/**
 * By nesting the app inside a router, we get the location object
 */
interface AppProps {}

const App: FC<AppProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const { sessionToken, login, logout, verifyToken, activeGame } = useContext(SessionContext);

  /**
   * starts app, setting sessiontoken
   */
  const signInAndLaunch = async () => {
    login()
      .then((sessionToken: string) => {
        console.log(sessionToken);
        navigate("game/setup");
      })
      .catch(e => {
        // check if error is a custom error from me or a standard error from Tomcat
        // Tomcat errors will be a string
        const errorIsCustomError = typeof e.response.data === "object"
        if (errorIsCustomError) {
          const error = e.response.data as ErrorMessage;
          console.log(error);
          setError(error.message);
        } else {
          console.log(e.response.statusText)
          setError(e.response.statusText);
        }
      });
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("sessionToken");
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, [verifyToken]);

  return (
    <>
      <div className={`banner ${location.pathname === "/" ? "" : "off-screen"}`}>
        {error && <div style={{ color: "red", position: "absolute", left: "50%", top: 20, transform: "translateX(-50%)" }}>{error}</div>}
        {sessionToken == null ? "NULL" : sessionToken}
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
