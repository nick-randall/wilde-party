import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getIdListObject } from "./helperFunctions/getIdList";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { useEffect } from "react";
import Player from "./Player";
import NonPlayerPlaces from "./NonPlayerPlaces";
import EnemyPlayer from "./EnemyPlayer";
import { createDeck } from "./allCards.ts/deckGenerator";

export const Table = () => {
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const screenSize = useSelector((state: RootState) => state.screenSize);
  const ids = getIdListObject(gameSnapshot);
  const {player, plays, draws, rolls } = useSelector((state: RootState) => state.gameSnapshot.current);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });
  console.log(createDeck())

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "blue" }}>
      <div style={{marginLeft:"50%", marginRight:"50%"}}>
        <div> current player: {player}</div>
        <div> plays left: {plays}</div>
        <div> draws left: {draws}</div>
        {/* <div> rolls left: {rolls}</div> */}
      </div>
      <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <NonPlayerPlaces places = {gameSnapshot.nonPlayerPlaces} screenSize={screenSize} />
      
     
        <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current = {player === 0}/>
        <Player id={gameSnapshot.players[1].id} screenSize={screenSize} places={gameSnapshot.players[1].places} current = {player === 1}/>
        <Player id={gameSnapshot.players[2].id} screenSize={screenSize} places={gameSnapshot.players[2].places} current = {player === 2}/>
        {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
      </DragDropContext>
    </div>
  );
};
