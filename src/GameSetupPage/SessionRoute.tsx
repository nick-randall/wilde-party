import axios from "axios";
import { Children, FC, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { host, port, useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";

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

interface SessionRouteProps {
  checkForActiveGames?: boolean;
  children: JSX.Element;
}

type GetSessionTokenSucessMessage = {
  type: "tokenValid" | "createdNewSessionToken";
  message: string;
  activeGame: GameStats;
};

const SessionRoute: FC<SessionRouteProps> = ({ checkForActiveGames, children }) => {
  const { sessionToken, login, logout, verifyToken, activeGame } = useContext(SessionContext);
  console.log(sessionToken)
  if (!sessionToken) {
    console.log(sessionToken)
    return <Navigate to="/" replace />;
  }
  if (activeGame) {
    return (
      <>
        {children}
        <ActiveGamePopUp activeGame={activeGame} />
      </>
    );
  }
  return <>{children}</>;
};

export default SessionRoute;
