import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { getIdListObject } from "./helperFunctions/getIdList";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { useEffect } from "react";
import { SpecialsZone } from "./SpecialsZone";

export const Board = () => {
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });

  return (
    <div style={{width: "100vw", height: "100vh", backgroundColor: "blue"}}>
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <div style={{ display: "block" }}>
        <SpecialsZone id={ids.pl0specialsZone} specialsCards={gameSnapshot.players[0].places.specialsZone.cards} />
        <div style={{ position: "relative", marginLeft: "auto", marginRight: "auto"}}>
          <GCZ
            id={ids.pl0GCZ}
            enchantmentsRowCards={gameSnapshot.players[0].places.enchantmentsRow.cards}
            GCZCards={gameSnapshot.players[0].places.GCZ.cards}
          />
        </div>
        <Hand id={ids.pl0hand} handCards={gameSnapshot.players[0].places.hand.cards} />
      </div>
    </DragDropContext>
    </div>
  );
};
