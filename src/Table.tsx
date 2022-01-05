import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { getIdListObject } from "./helperFunctions/getIdList";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { useEffect } from "react";
import { SpecialsZone } from "./SpecialsZone";
import UWZ from "./UWZ";
import { Deck } from "./Deck";
import Player from "./Player";
import getPlayersLayout from "./dimensions/getPlayersLayout";
import NonPlayerPlaces from "./NonPlayerPlaces";

export const Table = () => {
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const screenSize = useSelector((state: RootState) => state.screenSize);
  const ids = getIdListObject(gameSnapshot);
  const dispatch = useDispatch();
  const test = useSelector((state: RootState) => state.test);

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "blue" }}>
      <div style={{ width: 3, height: 3, backgroundColor: "red", zIndex: 100, left: -test.x, top: -test.y, position: "absolute" }} />
      <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <NonPlayerPlaces places = {gameSnapshot.nonPlayerPlaces} screenSize={screenSize} />
      
     
        <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} />
        <Player id={gameSnapshot.players[1].id} screenSize={screenSize} places={gameSnapshot.players[1].places} />
        <Player id={gameSnapshot.players[2].id} screenSize={screenSize} places={gameSnapshot.players[2].places} />
        {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
      </DragDropContext>
    </div>
  );
};
