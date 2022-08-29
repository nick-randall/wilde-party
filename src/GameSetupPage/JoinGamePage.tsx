import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JoinGameSuccessMessage, useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";
import AuthRoute from "./SessionRoute";
import GameSetupPagesWidget, { ActiveGames, TextInput, WaitingWidget, WidgetData } from "./GameSetupWidgets";
import { joinGameAlt } from "../api/api";
import { Transition } from "react-transition-group";
import { meaningfulErrorMessage } from "../api/meaningfulErrorMessage";

const JoinGamePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { joinGame } = useApi();
  const { sessionToken } = useContext(SessionContext);

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [selectedParty, setSelectedParty] = useState<GameStats>();
  const [error, setError] = useState<string>();
  const [playerName, setPlayerName] = useState();

  const navigateToWaitingPage = useCallback(
    partyAddress => {
      navigate("finished");
      setTimeout(() => navigate("/game/waiting", { state: partyAddress }), 1000);
      console.log("worked!")
    },
    [navigate]
  );

  const submitWidgetData = async (finalIndex?: boolean) => {
    if (selectedParty && playerName && sessionToken && finalIndex)
      try {
        const params = { partyAddress: selectedParty.partyAddress, joiningPlayerName: playerName };
        const response = await joinGameAlt(sessionToken, params);
        if (response.type === "joinedGame") {
          navigateToWaitingPage(selectedParty.partyAddress);
        }
      } catch (e) {
        setError(meaningfulErrorMessage(e))
        console.log(meaningfulErrorMessage(e));
      }
    setCurrIndex(s => s + 1);
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
   {index: 2, widgetComponent: error ? <div className="name-input-box">{error} <button className="name-input-button">Reset</button></div>: <div/> }
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
          <Transition timeout={0} in={true} appear={true}>
            {state => (
              <>
                <GameSetupPagesWidget {...widget} currIndex={state === "entering" ? -1 : currIndex} key={index} handleTransitionEnd={() => {}}>
                  {widget.widgetComponent}
                </GameSetupPagesWidget>
              </>
            )}
          </Transition>
        ))}
      </>
    </AuthRoute>
  );
};

export default JoinGamePage;
