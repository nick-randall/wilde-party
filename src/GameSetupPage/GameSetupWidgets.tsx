import React, { FC, useCallback, useEffect, useState } from "react";
import FlipMove from "react-flip-move";
import "./GameSetupPages.css";
export type WidgetData = {
  index: number;
  buttonText: string;
  buttonFunction: Function;
  widgetComponent: JSX.Element;
};

const host = "127.0.0.1";
const port = 8443;

export const ActiveGames: FC<InnerWidgetProps> = ({ value, setValue, setCurrIndex }) => {
  const [availableGames, setAvailableGames] = useState<GameStats[]>();
  const [error, setError] = useState<CloseEvent>();

  const attachToGamesStream = useCallback(async () => {
    try {
      const ws = new WebSocket(`wss://${host}:${port}/Wilde_Party/waiting-games-stream`);
      ws.onopen = () => {
        console.log("opened");
      };
      ws.onclose = (ev: CloseEvent) => {
        setAvailableGames(undefined);

        setError(ev);
      };
      ws.onmessage = (message: MessageEvent) => {
        console.log(message.data);
        // if(message.data)
        setAvailableGames(JSON.parse(message.data));
      };
    } catch (e: any) {
      console.log(e.response);
    }
  }, []);

  useEffect(() => {
    if (!availableGames) attachToGamesStream();
  }, [attachToGamesStream, availableGames]);

  const handleClick = (game: GameStats) => {
    // api.joinGame(game.partyAddress)
    setValue(game);
    setCurrIndex((s: number) => s + 1);
  };
  // if (error) return <>{error.response}</>;
  if (!availableGames) return <>Verbindungsfehler</>;
  else if (availableGames?.length === 0) {
    return <div>Keine Spiele verfügbar</div>;
  } else
    return (
      <>
        {availableGames.length === 0 && <button>Keine Spiele verfügbar</button>}
        {availableGames.map(game => (
          <FlipMove duration={1000}>
            <div key={game.id} className={`available-game-button ${game === value ? "selected" : ""}`} onClick={() => handleClick(game)}>
              {game.partyAddress}
            </div>
          </FlipMove>
        ))}
      </>
    );
};

type InnerWidgetProps = {
  value?: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  setCurrIndex: React.Dispatch<React.SetStateAction<any>>;
};

export const TextInput: FC<InnerWidgetProps> = ({ value, setValue, setCurrIndex }) => {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value)
  };
  const handleSubmit = () => {
    setCurrIndex((s: number) => s + 1);
  };
  return (
    <>
      <div className="name-input-box">
        <p>Wie heißt du?</p>
        <input className="name-input" type="text" value={value} onChange={handleChange} /> <button onClick={handleSubmit}>OK</button>
      </div>
    </>
  );
};

export const WaitingWidget: FC = () => {
  return (
    <>
      <p>Now in stream</p>
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
  const offscreenLeft = 100 * (currIndex - index + 1);

  return (<div className="wrapper" style={{ transform: `translateX(calc(${offscreenLeft}vw - 50%)` }}>
    <div className="game-setup-widget" >
      {widgetComponent}
    </div>
    </div>
  );
};

export default GameSetupPagesWidget;
