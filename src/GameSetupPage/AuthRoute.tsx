import axios from "axios";
import { Children, FC, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { host, port, useApi } from "../api/useApi";
import { AuthContext } from "../App";

interface ActiveGamePopUpProps {
  activeGame: GameStats;
}

const ActiveGamePopUp: FC<ActiveGamePopUpProps> = ({ activeGame }) => {
  return (
    <div style={{ zIndex: 100, height: "80vh", width: "80vh", position: "absolute", backgroundColor: "grey", transform: "translateX(-50%)", left: "50%"}}>
      <p>Du bist ja schon auf {activeGame.partyName}!</p>
      <button>Zurück zur Party</button>
      <button>Party verlassen</button>
    </div>
  );
};

interface AuthRouteProps {
  checkForActiveGames?: boolean;
  children: JSX.Element;
}

type GetSessionTokenSucessMessage = {
  type: "tokenExists" | "createdNewSessionToken";
  message: string;
  activeGame: GameStats;
};

const AuthRoute: FC<AuthRouteProps> = ({ checkForActiveGames, children }) => {
  const sessionToken = useContext(AuthContext);
  const [activeGame, setActiveGame] = useState<GameStats>();
  const [tokenExpired, setTokenExpired] = useState<boolean>();

  useEffect(() => {
    console.log("in authroute");
    console.log(sessionToken + "is session token from AuthContext");
    if (sessionToken)
      axios
        .get(`https://${host}:${port}/Wilde_Party/get-session-token`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        })
        .then(response => {
          console.log(response.headers.sessiontoken);
          const message = response.data as GetSessionTokenSucessMessage;
          console.log(message.type)
          if (message.type === "createdNewSessionToken") {
            console.log("created new session token " + response.headers.sessiontoken);
          }
          if(message.type=== "tokenExists") {
            console.log("token exists-- should be called token is valid ")
          }
          if (checkForActiveGames && message.type === "tokenExists") {
            const { activeGame } = message;
            console.log(activeGame)
            console.log(message)
            setActiveGame(activeGame);
          }
          window.localStorage.setItem("sessiontoken", response.headers.sessiontoken);
        })
        .catch(e => {
          if (e.response.status === 401) {
            console.log("got a 401")
            console.log(e.response)
            setTokenExpired(true);
            window.localStorage.removeItem("sessiontoken");
          }
        });
  }, [checkForActiveGames, sessionToken]);

  if (!sessionToken || tokenExpired) {
    return <Navigate to="/" replace />;
  }
  if (activeGame !== undefined) {
    return (
      <>
        {children}
        <ActiveGamePopUp activeGame={activeGame} />
      </>
    );
  }
  return <>{children}</>;
};

export default AuthRoute;
