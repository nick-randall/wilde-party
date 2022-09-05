import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import Game from "./GamePath";
import "./css/global.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import { host, port } from "./api/useApi";
import { checkSessionToken, signInAnonymously } from "./api/api";
import SessionProvider, { ErrorMessage, SessionContext } from "./SessionProvider";
import { meaningfulErrorMessage } from "./api/meaningfulErrorMessage";

/**
 * By nesting the app inside a router, we get the location object
 */
interface AppProps {}

const App: FC<AppProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { sessionToken, login, logout, verifyToken, activeGame } = useContext(SessionContext);

  /**
   * starts app, setting sessiontoken
   */
  const signInAndLaunch = async () => {
    setLoading(true);
    login()
      .then((sessionToken: string) => {
        console.log(sessionToken);
        navigate("game/setup");
      })
      .catch(e => {
        setError(meaningfulErrorMessage(e));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("sessionToken");
    if (savedToken && !sessionToken) {
      verifyToken(savedToken);
    }
  }, [verifyToken, sessionToken]);

  return (
    <>
      <div className={`banner ${location.pathname === "/" ? "" : "off-screen"}`}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {error && <div style={{ color: "red", position: "absolute", left: "50%", top: 20, transform: "translateX(-50%)" }}>{error}</div>}
          {sessionToken == null ? "NULL" : sessionToken}
          {sessionToken && !activeGame && (
            <div className={`button`}>
              <Link to="/game/setup">starten</Link>
            </div>
          )}
          {sessionToken && activeGame && (
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <div className={`button`}>
                <Link to="/game/waiting" state={activeGame.partyName || "no name"}>
                  zurück zum Spiel
                </Link>
              </div>
              <div className={`button`}>Spiel verlassen</div>
            </div>
          )}
          {!sessionToken && !activeGame && (
            <div className="button pulsing" onClick={loading ? () => null : signInAndLaunch}>
              {loading ? "laden..." : "starten"}
            </div>
          )}
          {sessionToken}
        </div>
      </div>
      <Routes>
        <Route path="/game/*" element={<Game />} />
      </Routes>
    </>
  );
};

export default App;
