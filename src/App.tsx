import { createContext, FC, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Game from "./GamePath";
import "./css/global.css";
import axios from "axios";
import { host, port } from "./api/useApi";

interface GetSessionTokenSuccessMessage {
  type: string;
  message: string;
  activeGame: GameStats;
}

/**
 * By nesting the app inside a router, we get the location object
 */
interface AppProps {}

export const AuthContext = createContext<SessionToken>(null);

type SessionToken = null | string;

const App: FC<AppProps> = () => {
  const location = useLocation();
  const [sessionToken, setSessionToken] = useState<SessionToken>(null);
  const [loading, setLoading] = useState(false);
  const [activeGame, setActiveGame] = useState<GameStats>();
  useEffect(() => {
    if(sessionToken) return;
    const oldToken = window.localStorage.getItem("sessionToken");
    console.log(oldToken);
    if (oldToken !== null) {
      setSessionToken(oldToken);
    }
    setLoading(true);
    axios
      .get(`https://${host}:${port}/Wilde_Party/get-session-token`, {
        // headers: {
        //   Authorization: `Bearer ${sessionToken}`,
        // },
      })
      .then(response => {
        const { sessiontoken } = response.headers;
        console.log(sessiontoken)
        console.log(response.headers)
        setSessionToken(sessiontoken);
        window.localStorage.setItem("sessiontoken", response.headers.sessiontoken);
        const { type, message, activeGame } = response.data as GetSessionTokenSuccessMessage;
        console.log(message);
        console.log(sessiontoken);
        if (activeGame) {
          setActiveGame(activeGame);
        }
        setLoading(false);
      })
      .catch(e => {
        if (e.response.status === 401) {
          window.localStorage.removeItem("sessionToken");
          setSessionToken(null);
          setLoading(false);
        }
      });
      console.log(sessionToken)
  }, [sessionToken]);

  console.log(location.pathname);
  return (
    <AuthContext.Provider value={sessionToken}>
      <div className={`banner ${location.pathname === "/" ? "" : "off-screen"}`}>
        {sessionToken && !loading && !activeGame && (
          <div className={`button pulsing`}>
            <Link to="/game/setup">starten</Link>
          </div>
        )}
        {sessionToken && !loading && activeGame && (
          <div className={`button pulsing`}>
            <Link to="/game/setup">zurück zum Spiel</Link>
          </div>
        )}
        {sessionToken}
      </div>
      <Routes>
        <Route path="/game/*" element={<Game />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
