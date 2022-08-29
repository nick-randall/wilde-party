import axios, { AxiosResponse } from "axios";
import { host, port } from "./useApi";


interface AnonymousSignInSuccessMessage {
  type: string;
  message: string;
  sessionToken: string;
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

  
