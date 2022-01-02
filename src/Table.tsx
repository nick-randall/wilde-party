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

export const Table = () => {
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);
  const dispatch = useDispatch();
  const test = useSelector((state: RootState) => state.test)

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });

  return (
    <div style={{width: "100vw", height: "100vh", backgroundColor: "blue"}}>
      <div style={{width:3, height: 3, backgroundColor: "red", zIndex:100, left: -test.x, top: -test.y, position:"absolute"}}/>
      <Deck id={ids.deck} cards={gameSnapshot.nonPlayerPlaces.deck.cards}/>
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <div>
        <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} />
      </div>
      <div style={{ display: "block" }}>
        <SpecialsZone id={ids.pl0specialsZone} specialsCards={gameSnapshot.players[0].places.specialsZone.cards} />
        <div >
          <GCZ
            id={ids.pl0GCZ}
            enchantmentsRowCards={gameSnapshot.players[0].places.enchantmentsRow.cards}
            GCZCards={gameSnapshot.players[0].places.GCZ.cards}
          />
        </div>
        <Hand id={ids.pl0hand} handCards={gameSnapshot.players[0].places.hand.cards} />
      </div>
      <UWZ id={ids.pl0UWZ} unwantedCards={gameSnapshot.players[0].places.UWZ.cards} />
      <Player player = {gameSnapshot.players[0]} />
    </DragDropContext>
    </div>
  );
};
