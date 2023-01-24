import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Transition } from "react-transition-group";
import { useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";
import SelectPlayers from "./CreateGameWidgets";
import GameSetupPagesWidget from "./GameSetupPagesWidget";
import { ActiveGames } from "./JoinGameWidgets";
import AuthRoute from "./SessionRoute";

interface CreateGamePageProps {}

const CreateGamePage: FC<CreateGamePageProps> = () => {
  // useEffect(() => {
  //   if (sessionToken) api.createNewGame(sessionToken, 3, 3, "me is creator,", "my Party");
  // });

  const location = useLocation();
  const navigate = useNavigate();
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
    createGame();

    // if (atFinalIndex && sessionToken && createGameData.partyAddress && createGameData.playerName) {
    //   try {
    //     const response = await joinGameAlt(sessionToken, createGameData);
    //     console.log(response);
    //     if (response.type === "joinedGame") {
    //       navigateToWaitingPage(response.gameStats.partyName);
    //     }
    //   } catch (e) {
    //     setError(meaningfulErrorMessage(e));
    //     console.log(meaningfulErrorMessage(e));
    //   }
    // }
  };

  const widgetsData: WidgetData[] = [
    {
      index: 0,
      widgetComponent: <SelectPlayers setSetupData={setSetupData} submit={submitWidgetData} setupData={setupData} />,
    },
  ];
  const api = useApi();
  const createGame = useCallback(() => {
    if (sessionToken) api.createNewGame(sessionToken, 3, 0, "nick", "nick's party");
  }, [api, sessionToken]);

  // useEffect(() => createGame(),[createGame]);
  return (
    <AuthRoute checkForActiveGames>
      <>
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
    </AuthRoute>
  );
};

export default CreateGamePage;
