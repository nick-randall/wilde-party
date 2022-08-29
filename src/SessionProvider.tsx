import { AxiosError, AxiosResponse } from "axios";
import React, { useState, useCallback, useEffect, createContext } from "react";
import { checkSessionToken, signInAnonymously } from "./api/api";

export type Session = {
  sessionToken: string | null;
  login: (e?: string, pw?: string) => Promise<string>;
  logout: () => void;
  verifyToken: (t: string) => void;
  activeGame?: GameStats;
};

export const SessionContext = createContext<Session>({
  sessionToken: null,
  login: (e?: string, p?: string) => new Promise(r => r("test")),
  logout: () => console.log("logout method not initialised"),
  verifyToken: t => console.log("verify method not initialised"),
});

export type ErrorMessage = {
  type: "sessionTokenError" | "createGameError" | "joinGameError" | "getWebsocketTokenError";
  reason:
    | "noTokenProvided"
    | "sessionTokenExpired"
    | "gameAlreadyInProgress"
    | "tokenInvalid"
    | "noPartyAddressProvided"
    | "gameNotFound"
    | "userAlreadyPartOfGame"
    | "userSessionNotFound";
  message: string;
};

const SessionProvider = ({ children }: { children: JSX.Element }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [activeGame, setActiveGame] = useState<GameStats>();

  const login = (email?: string, password?: string)  =>
    new Promise<string>((resolve, reject) => {
      // if (!email && !password)
      signInAnonymously()
        .then(response => {
          const { message, sessionToken } = response.data;
          console.log(message)
          setSessionToken(sessionToken)
          window.localStorage.setItem("sessionToken", sessionToken)
          resolve(response.data.sessionToken);
        })
        .catch(e => reject(e));
    });

  const logout = () => {
    window.localStorage.removeItem("sessionoken");
    setSessionToken(null);
  };

  const verifyToken = async (savedToken: string) => {
    console.log("session provider verifying token " + savedToken);
    try {
      const { type, message, activeGame } = await checkSessionToken(savedToken);
      // const response = await checkSessionToken(savedToken);
      // const { type, message, activeGame } = response.data
      setSessionToken(savedToken);
      console.log(activeGame)
      setActiveGame(activeGame);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error.response?.status);
      if (error.response?.status === 401) {
        console.log("should logout");
        logout();
      }
    }
  };

  const session: Session = { sessionToken, login, logout, verifyToken, activeGame };

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export default SessionProvider;
