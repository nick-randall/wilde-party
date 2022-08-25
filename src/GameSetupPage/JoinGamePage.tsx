import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";
import AuthRoute from "./AuthRoute";
import GameSetupPagesWidget, { ActiveGames, TextInput, WaitingWidget, WidgetData } from "./GameSetupWidgets";


const JoinGamePage: FC = () => {
  const location = useLocation();
  const { joinGame } = useApi();
  const {sessionToken} = useContext(SessionContext);

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [selectedParty, setSelectedParty] = useState<GameStats>();
  const [playerName, setPlayerName] = useState();


  const widgetsData: WidgetData[] = [
    {
      index: 1,
      buttonText: "Wo geht's hin?",
      buttonFunction: () => null,
      widgetComponent: <ActiveGames value={selectedParty} setValue={setSelectedParty} setCurrIndex={setCurrIndex} />,
    },
    {
      index: 2,
      buttonText: "OK",
      buttonFunction: () => null,
      widgetComponent: <TextInput setValue={setPlayerName} value={playerName} setCurrIndex={setCurrIndex} />,
    },
    {
      index: 3,
      buttonText: "Spiel verlassen",
      buttonFunction: () => null,
      widgetComponent: <WaitingWidget />,
    },
  ];

  useEffect(() => {
    if (selectedParty && playerName && sessionToken && currIndex === widgetsData.length - 1) {
      joinGame(sessionToken, selectedParty.partyAddress, playerName);
    }
  });

  return (
    <AuthRoute checkForActiveGames>
      <>
        {widgetsData.map((widget, index) => (
          <GameSetupPagesWidget {...widget} currIndex={currIndex} numWidgets={widgetsData.length} key={index}>
            {widget.widgetComponent}
          </GameSetupPagesWidget>
        ))}
      </>
    </AuthRoute>
  );
};

export default JoinGamePage;
