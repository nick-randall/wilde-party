import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import FlipMove from "react-flip-move";
import { TransitionGroup } from "react-transition-group";
import { useApi } from "../api/useApi";
import { AuthContext } from "../App";
import "./GameSetupPages.css";
import JoinGameButton from "./JoinButton";
export type WidgetData = {
  index: number;
  buttonText: string;
  buttonFunction: Function;
  widgetComponent: JSX.Element;
};

const host = "127.0.0.1";
const port = 8443;

export const ActiveGames: FC<ActiveGamesProps> = ({ selectedParty, setSelected }) => {
  const [availableGames, setAvailableGames] = useState<GameStats[]>();
  const api = useApi();
  // const token = useContext(AuthContext);

  useEffect(() => {
    const ws = new WebSocket(`wss://${host}:${port}/Wilde_Party/waiting-games-stream`);
    ws.onmessage = (message: MessageEvent) => {
      console.log(message.data);
      setAvailableGames(JSON.parse(message.data));
    };
  });

  // const handleClick = (game: GameStats) => {
  //   api.joinGame(game.partyAddress)
  // };
  console.log(selectedParty)

  if (availableGames === undefined) return <></>;
  else if (availableGames?.length === 0) {
    return <div>Keine Spiele verfügbar</div>;
  } else
    return (
      <>
        {availableGames.map(game => (
          <FlipMove duration={1000}>
            <div className={`available-game-button ${game === selectedParty ? "selected" : ""}`} onClick={() => setSelected(game)}>
              {game.partyAddress}
            </div>
          </FlipMove>
        ))}
      </>
    );
};

type ActiveGamesProps = {
  selectedParty?: GameStats;
  setSelected: (game: GameStats) => void;
};

type TextInputProps = {
  state: string;
  setStateFunction: (ev: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput: FC<TextInputProps> = ({ state, setStateFunction }) => {
  return (
    <>
      <div className="name-input-box">
        <p>Wie heißt du?</p>
        <input className="name-input" type="text" value={state} onChange={setStateFunction} />{" "}
      </div>
    </>
  );
};

export const WaitingWidget: FC = () => {
  return (
    <>
      <p>Doing fancy api call stuff...</p>
    </>
  );
};
type WidgetProps = WidgetData & {
  numWidgets: number;
  children: JSX.Element;
  currIndex: number;
};

const GameSetupPagesWidget: FC<WidgetProps> = widgetData => {
  const { currIndex, index, widgetComponent } = widgetData;
  const offscreenLeft = 100 * (currIndex - index);

  return (
    <div className="game-setup-widget" style={{ gridRow: 2, transform: `translateX(calc(${offscreenLeft}vw - 50%)` }}>
      {widgetComponent}
    </div>
  );
};

export default GameSetupPagesWidget;
