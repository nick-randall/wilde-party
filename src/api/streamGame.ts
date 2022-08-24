import { useDispatch } from "react-redux";

export type UpdateGameStats = { type: "UPDATE_GAME_STATS"; payload: GameStats };

export const updateGameStats = (gameStats: GameStats): UpdateGameStats => ({ type: "UPDATE_GAME_STATS", payload: gameStats });

export type GameStreamActions = UpdateGameStats;

type GameUpdateMessage = {
  type: "playerJoined" | "gameBegins";
  gameSnapshot?: GameSnapshot;
  gameStats?: GameStats;
  message: string;
};

const useStreamGame = () => {
  const dispatch = useDispatch();
  const handleWebsocketMessages = (message: MessageEvent) => {
    const gameUpdate = message.data as GameUpdateMessage;
    console.log(gameUpdate.type);
    console.log(gameUpdate.message);
    console.log(gameUpdate.gameStats);
  };
  return { handleWebsocketMessages };
};

export default useStreamGame;
