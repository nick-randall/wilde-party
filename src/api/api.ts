import axios, { AxiosResponse } from "axios";
import { host, port } from "./useApi";

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


export const signInAnonymously = async (): Promise<AxiosResponse> =>
  axios.get(`https://${host}:${port}/Wilde_Party/sign-in-anonymously`);

export const checkSessionToken = async (sessionToken: string): Promise<CheckSessionTokenSuccessMessage> =>
  axios.get(`https://${host}:${port}/Wilde_Party/check-session-token`, { headers: { Authorization: `Bearer ${sessionToken}` } });
