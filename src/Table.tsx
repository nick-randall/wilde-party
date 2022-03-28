import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { useEffect, useState } from "react";
import Player from "./Player";
import NonPlayerPlaces from "./NonPlayerPlaces";
import { dealInitialHands } from "./thunks/dealInitialCards";
import EnemyPlayer from "./EnemyPlayer";
import "./css/global.css";
import { GCZCards } from "./createGameSnapshot/sampleCards";
import { getCardGroupsObjsnew } from "./helperFunctions/groupGCZCardNew";

export const Table = () => {
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const screenSize = useSelector((state: RootState) => state.screenSize);
  const { player, plays, draws, rolls, phase } = useSelector((state: RootState) => state.gameSnapshot.current);
  const [gameStarted, setGameStarted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });
  useEffect(() => {
    if (!gameStarted) {
      console.log("called it");
      dispatch(dealInitialHands());
      setGameStarted(true);
    }
  }, [dispatch, gameStarted]);

const cards = GCZCards;

console.log(getCardGroupsObjsnew(cards));

  return (
    <div>
      <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
        <NonPlayerPlaces places={gameSnapshot.nonPlayerPlaces} screenSize={screenSize} />

        <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current={player === 0} />
        <EnemyPlayer id={gameSnapshot.players[1].id} screenSize={screenSize} places={gameSnapshot.players[1].places} current={player === 1} />
        <EnemyPlayer id={gameSnapshot.players[2].id} screenSize={screenSize} places={gameSnapshot.players[2].places} current={player === 2} />
        {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
      </DragDropContext>
    </div>
  );
};
