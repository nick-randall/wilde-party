import { FC, useState } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CreateGamePage from "./CreateGamePage";
import JoinGamePage from "./JoinGamePage";
import { WidgetData, ActiveGames, TextInput, WaitingWidget } from "./GameSetupWidgets";

interface GameSetupProps {}

const GameSetup: FC<GameSetupProps> = () => {
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [selectedParty, setSelectedParty] = useState<GameStats>();
  const [playerName, setPlayerName] = useState("");


  const joinGamesWidgetsData: WidgetData[] = [
    {
      index: 0,
      buttonText: "zur Party einer Freund*in",
      buttonFunction: () => null,
      widgetComponent: <></>,
    },
    {
      index: 1,
      buttonText: "Wo geht's hin?",
      buttonFunction: () => null,
      widgetComponent: <ActiveGames selectedParty={selectedParty} setSelected = {setSelectedParty}/>,
    },
    {
      index: 2,
      buttonText: "OK",
      buttonFunction: () => null,
      widgetComponent: <TextInput setStateFunction={ev => setPlayerName(ev.target.value)} state={playerName} />,
    },
    {
      index: 3,
      buttonText: "Spiel verlassen",
      buttonFunction: () => null,
      widgetComponent: <WaitingWidget />,
    }
  ];

  return (
    <>
      <p>{playerName}</p>
      <p>{selectedParty?.partyAddress}</p>
      <div style={{ display: "grid", gridTemplateColumns: 4, gridTemplateRows: 8, justifyContent: "center", height: "100%" }}>
        <Link to="/game/setup/createGame" style={{ gridColumn: 2, gridRow: 3 }}>
          <div className={`button  ${location.pathname === "/game/setup/joinGame" ? "offscreen-top" : ""}`}>Neue Party starten</div>
        </Link>
        <Link to="/game/setup/joinGame" style={{ gridColumn: 2, gridRow: 4 }} onClick={() => setCount(s => s + 1)}>
          <div className={`button  ${location.pathname === "/game/setup/createGame" ? "offscreen-bottom" : ""}`}>{joinGamesWidgetsData[count].buttonText}</div>
        </Link>

        <TransitionGroup component="div" className="App">
          <CSSTransition key={location.pathname} timeout={1000} classNames="my-node" unmountOnExit={true}>
            <Routes>
              <Route path="/joinGame/*" element={<JoinGamePage index={count} widgetsData={joinGamesWidgetsData} />} />
              <Route path="/createGame/*" element={<CreateGamePage />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </>
  );
};

export default GameSetup;
