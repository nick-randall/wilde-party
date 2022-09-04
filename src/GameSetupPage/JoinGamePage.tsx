import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";
import AuthRoute from "./SessionRoute";
import { ActiveGames, TextInput } from "./JoinGameWidgets";
import { joinGameAlt } from "../api/api";
import { Transition } from "react-transition-group";
import { meaningfulErrorMessage } from "../api/meaningfulErrorMessage";
import GameSetupPagesWidget from "./GameSetupPagesWidget";

const JoinGamePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { joinGame } = useApi();
  const { sessionToken } = useContext(SessionContext);

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [setupData, setSetupData] = useState<JoinGameParams>({ playerName: "", partyAddress: "" });
  const [error, setError] = useState<string>();

  const navigateToWaitingPage = useCallback(
    partyName => {
      navigate("finished");
      setTimeout(() => navigate("/game/waiting", { state: { partyName } }), 1000);
      console.log("worked!");
    },
    [navigate]
  );

  const submitWidgetData = async (atFinalIndex?: boolean) => {
    setCurrIndex(s => s + 1);

    if (atFinalIndex && sessionToken && setupData.partyAddress && setupData.playerName) {
      try {
        const response = await joinGameAlt(sessionToken, setupData);
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
      widgetComponent: <ActiveGames setSetupData={setSetupData} submit={submitWidgetData} setupData={setupData} />,
    },
    {
      index: 1,
      widgetComponent: <TextInput setSetupData={setSetupData} submit={submitWidgetData} setupData={setupData} atFinalIndex />,
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

  return (
    <AuthRoute checkForActiveGames>
      <>
        {/* <div style={{position: "relative"}}> */}
        {widgetsData.map((widget, index) => (
          <Transition timeout={0} in={true} appear={true}>
            {state => (
              <GameSetupPagesWidget {...widget} currIndex={state === "entering" ? -1 : currIndex} key={index}>
                {widget.widgetComponent}
              </GameSetupPagesWidget>
            )}
          </Transition>
        ))}
      </>
      {/* </div> */}
    </AuthRoute>
  );
};

export default JoinGamePage;
