import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";
import AuthRoute from "./SessionRoute";
import GameSetupPagesWidget, { ActiveGames, TextInput, WidgetData } from "./GameSetupWidgets";
import { joinGameAlt } from "../api/api";
import { Transition } from "react-transition-group";
import { meaningfulErrorMessage } from "../api/meaningfulErrorMessage";

const JoinGamePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { joinGame } = useApi();
  const { sessionToken } = useContext(SessionContext);

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [joinGameData, setJoinGameData] = useState<JoinGameParams>({ playerName: "", partyAddress: "" });
  const [error, setError] = useState<string>();

  const navigateToWaitingPage = useCallback(
    partyName => {
      navigate("finished");
      setTimeout(() => navigate("/game/waiting", { state: {partyName} }), 1000);
      console.log("worked!");
    },
    [navigate]
  );

  const submitWidgetData = async (atFinalIndex?: boolean) => {
    setCurrIndex(s => s + 1);

    if (atFinalIndex && joinGameData.partyAddress && joinGameData.playerName && sessionToken) {
      try {
        const response = await joinGameAlt(sessionToken, joinGameData);
        console.log(response);
        if (response.type === "joinedGame") {
          navigateToWaitingPage(response.gameStats.partyName);
        }
      } catch (e) {
        setError(meaningfulErrorMessage(e));
        console.log(meaningfulErrorMessage(e));
      }
    }
  };

  const widgetsData: WidgetData[] = [
    {
      index: 0,
      widgetComponent: <ActiveGames setJoinGameData={setJoinGameData} submit={submitWidgetData} joinGameData={joinGameData} />,
    },
    {
      index: 1,
      widgetComponent: <TextInput setJoinGameData={setJoinGameData} submit={submitWidgetData} joinGameData={joinGameData} atFinalIndex/>,
    },
    {
      index: 2,
      widgetComponent: error ? (
        <div className="name-input-box">
          {error} <button className="name-input-button">Reset</button>
        </div>
      ) : (
        <div />
      ),
    },
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
