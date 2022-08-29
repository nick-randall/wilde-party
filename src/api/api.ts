import axios, { AxiosResponse } from "axios";
import { host, JoinGameSuccessMessage, port } from "./useApi";

interface CheckSessionTokenSuccessMessage {
  type: string;
  message: string;
  activeGame: GameStats;
}

interface AnonymousSignInSuccessMessage {
  type: string;
  message: string;
  sessionToken: string;
}

interface JoinGameParams {
  partyAddress: string;
  joiningPlayerName: string;
}

export const signInAnonymously = async (): Promise<AxiosResponse> => axios.get(`https://${host}:${port}/Wilde_Party/sign-in-anonymously`);

export const checkSessionToken = async (sessionToken: string): Promise<CheckSessionTokenSuccessMessage> =>
  axios.get(`https://${host}:${port}/Wilde_Party/check-session-token`, { headers: { Authorization: `Bearer ${sessionToken}` } }).then(e => e.data);

export const joinGameAlt = async (sessionToken: string, params: JoinGameParams): Promise<JoinGameSuccessMessage> =>
  axios.post(`https://${host}:${port}/Wilde_Party/join-game`, params, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  }).then(r => r.data);

  
