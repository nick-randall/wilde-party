import React, { FC, useCallback, useEffect, useState } from "react";
import FlipMove from "react-flip-move";
import "./GameSetupPages.css";



const host = "127.0.0.1";
const port = 8443;

export const ActiveGames: FC<InnerWidgetProps> = ({ submit, atFinalIndex, setupData, setSetupData }) => {
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
    console.log("reloading active games widget");
  }, [attachToGamesStream, availableGames]);

  const handleClick = (game: GameStats) => {
    // api.joinGame(game.partyAddress)
    // setValue(game);
    setSetupData(prevState => ({ ...prevState, partyAddress: game.partyAddress }));

    submit(atFinalIndex);
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
          <FlipMove duration={1000} key={game.id}>
            <div className={`available-game-button ${game.partyAddress === setupData.partyAddress ? "selected" : ""}`} onClick={() => handleClick(game)}>
              {game.partyAddress}
            </div>
          </FlipMove>
        ))}
      </>
    );
};



export const TextInput: FC<InnerWidgetProps> = ({ submit, atFinalIndex, setSetupData, setupData }) => {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    // setValue(ev.target.value);
    setSetupData(prevState => ({ ...prevState, playerName: ev.target.value }));
  };
  return (
    <>
      <div className="name-input-box">
        <p>Wie heißt du?</p>
        <input className="name-input" type="text" value={setupData.playerName} onChange={handleChange} />
      </div>
      <button className="name-input-button" onClick={() => submit(atFinalIndex)}>
        OK
      </button>
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