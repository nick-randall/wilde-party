import axios, { AxiosResponse } from "axios";
import { host, port } from "./useApi";


interface AnonymousSignInSuccessMessage {
  type: string;
  message: string;
  sessionToken: string;
}



export const signInAnonymously = async (): Promise<AxiosResponse> => axios.get(`https://${"localhost"}:${port}/WildeParty-0.0.1/sign-in-anonymously`);

export const checkSessionToken = async (sessionToken: string): Promise<CheckSessionTokenSuccessMessage> =>
  axios.get(`https://${"localhost"}:${port}/WildeParty-0.0.1/check-session-token`, { headers: { Authorization: `Bearer ${sessionToken}` } }).then(e => e.data);

export const joinGameAlt = async (sessionToken: string, params: JoinGameParams): Promise<JoinGameSuccessMessage> =>
  axios.post(`https://${"localhost"}:${port}/WildeParty-0.0.1/join-game`, params, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  }).then(r => r.data);

  
