import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JoinGameSuccessMessage, useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";
import AuthRoute from "./SessionRoute";
import GameSetupPagesWidget, { ActiveGames, TextInput, WaitingWidget, WidgetData } from "./GameSetupWidgets";
import { joinGameAlt } from "../api/api";
import { Transition } from "react-transition-group";

const JoinGamePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { joinGame } = useApi();
  const { sessionToken } = useContext(SessionContext);

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [selectedParty, setSelectedParty] = useState<GameStats>();
  const [playerName, setPlayerName] = useState();

  const navigateToWaitingPage = useCallback(async () => {
    if (selectedParty && playerName && sessionToken)
      try {
        await joinGameAlt(sessionToken, { partyAddress: selectedParty.partyAddress, joiningPlayerName: playerName });
        navigate("/game/waiting", { state: selectedParty.partyAddress });
      } catch (e) {
        console.log(e);
      }
  }, [navigate, playerName, selectedParty, sessionToken]);

  const submitWidgetData = async (finalIndex?: boolean) => {
    setCurrIndex(s => s + 1);

    if (finalIndex) {
      navigate("finished");

      setTimeout(() => {
        navigateToWaitingPage();
      }, 1000);
    }
  };

  const widgetsData: WidgetData[] = [
    {
      index: 0,
      widgetComponent: <ActiveGames value={selectedParty} setValue={setSelectedParty} submit={submitWidgetData} />,
    },
    {
      index: 1,
      widgetComponent: <TextInput setValue={setPlayerName} value={playerName} submit={submitWidgetData} finalIndex />,
    },
    // {
    //   index: 3,
    //   widgetComponent: <WaitingWidget />,
    // },
  ];

  // const handleTransitionEnd = async () => {
  //   console.log(selectedParty, playerName, sessionToken)
  //   if (selectedParty && playerName && sessionToken) {
  //     // try {
  //     //   const { partyAddress } = await joinGame(sessionToken, selectedParty.partyAddress, playerName);
  //     //   // prevent any other transitionend events cause the function to fire.
  //     //   setCurrIndex(-1);
  //     //   navigate("game/waiting", { state: partyAddress });
  //     // } catch (e) {
  //     //   console.log(e);
  //     // }

  //     try {
  //       await joinGameAlt(sessionToken, { partyAddress: selectedParty.partyAddress, joiningPlayerName: playerName });
  //       // prevent any other transitionend events cause the function to fire.
  //       setCurrIndex(-1);
  //       navigate("/game/waiting", { state: selectedParty.partyAddress });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // };

  // const handleTransitionEndFunc = currIndex === widgetsData.length ? handleTransitionEnd : () => null;
  useEffect(() => {
    // if (selectedParty && playerName && sessionToken && currIndex === widgetsData.length - 1) {
    //   joinGame(sessionToken, selectedParty.partyAddress, playerName);
    // }
  });

  return (
    <AuthRoute checkForActiveGames>
      <>
        {widgetsData.map((widget, index) => (
          <Transition timeout={0} in={true}>
            {state => (
              <>
              <GameSetupPagesWidget {...widget} currIndex={state === "entering" ? 0 : currIndex} key={index} handleTransitionEnd={() => {}}>
                {widget.widgetComponent}
              </GameSetupPagesWidget>
            {state}
            </> )}
            
          </Transition>
        ))}
      </>
    </AuthRoute>
  );
};

export default JoinGamePage;
