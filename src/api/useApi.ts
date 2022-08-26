import axios from "axios";
import { FC, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import useStreamGame from "./streamGame";

export const host = "127.0.0.1";
export const port = 8443;

type NewGameParams = {
  numPlayers: number;
  numHumans: number;
  creatorName: string;
};

type JoinGameSuccessMessage = {
  type: "joinedGame";
  message: string;
  partyAddress: string;
  websocketToken: string;
};
export const useApi = () => {
  const dispatch = useDispatch();
  const { handleWebsocketMessages } = useStreamGame();

  const joinGame = useCallback((sessionToken: string, partyAddress: string, joiningPlayerName: string) => {
    axios
      .post(
        `https://${host}:${port}/Wilde_Party/join-game`,
        { partyAddress, joiningPlayerName },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      )
      .then(response => {
        const message: JoinGameSuccessMessage = response.data;
        console.log(message.message);
        console.log(message.partyAddress + " is the party adress");
        console.log(message.type);

        // TODO: now use the websocketToken and start waiting for all players to join.
        const ws = new WebSocket(`wss://${host}:${port}/Wilde_Party/websocket-session/${message.websocketToken}`);
        ws.onmessage = handleWebsocketMessages;
      })
      .catch(error => {
        console.log(error.response);
        if (error.response.status === 401) {
          // setSessionToken("");
          // localStorage.setItem("sessionToken", undefined);
        }
      });
  }, []);

  const createNewGame = useCallback((sessionToken: string, numPlayers: number, numHumans: number, creatorName: string, partyName: string) => {
    axios
      .post(
        `https://${host}:${port}/Wilde_Party/create-game`,
        { numPlayers, numHumans, creatorName, partyName },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(`Error creating a game: ${error}`);
        console.log(error.response.status);
        console.log(error.response);
        if (error.response.status === 401) {
          console.log(error.response);
          // setSessionToken("");
          // localStorage.setItem("sessionToken", undefined);
        } else if (error.response.data.reason === "gameAlreadyInProgress") {
          console.log("game is already in progress!");
        }
      })
      .finally(() => {});
  }, []);

  return { joinGame, createNewGame };
};
