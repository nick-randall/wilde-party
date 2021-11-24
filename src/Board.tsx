import { BeforeCapture, DragDropContext, DraggableLocation, DragStart, DragUpdate, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { locate, locate3 } from "./helperFunctions/locateFunctions";
import { getCardGroupObjs, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { getIdListObject } from "./helperFunctions/getIdList";
import { useState } from "react";

export const Board = () => {
  const dispatch = useDispatch();
  const [rearrange, setRearrange] = useState<SimpleRearrangingData>({ placeId: "", draggableId: "", sourceIndex: -1 });
  const [dragUpdate, setDragUpdate] = useState<UpdateDragData>({ droppableId: "", index: -1 });

  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);
  const highlights = useSelector((state: RootState) => state.highlights);

  
  const changeCardIndex = (card: GameCard, change: number) => ({ ...Object.entries(card), index : card.index += change})
  console.log(changeCardIndex(gameSnapshot.players[0].places.GCZ.cards[0], 2))


  const handleBeforeCapture = ({ draggableId }: { draggableId: string }) => dispatch({ type: "SET_DRAGGED_HAND_CARD", payload: draggableId });

  const handleDragStart = ({ source, draggableId }: { source: DraggableLocation; draggableId: string }) => {
    locate3(source.droppableId).place === "hand" ? dispatch({ type: "SET_HIGHLIGHTS", payload: draggableId }) : dispatch({ type: "ALLOW_REARRANGING", payload: source.droppableId });
    setRearrange({ placeId: source.droppableId, sourceIndex: source.index, draggableId });
  };

  const handleDragUpdate = (d: DragUpdate) => (d.destination ? setDragUpdate(d.destination) : () => {});

  const hasMoved = (d: DropResult) => d.destination && d.destination.index !== d.source.index;

  const movedWithinOnePlace = (d: DropResult) => d.destination && d.destination.droppableId === d.source.droppableId;

  const isRearrange = (d: DropResult) => hasMoved(d) && movedWithinOnePlace(d);

  const handleDragEnd = (d: DropResult) => {
    if (isRearrange(d)) dispatch({ type: "REARRANGE", payload: d });
    setDragUpdate({ droppableId: "", index: -1 });
    setRearrange({ placeId: "", draggableId: "", sourceIndex: -1 });
    dispatch({ type: "SET_DRAGGED_HAND_CARD", payload: undefined });
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <div>
        <GCZ
          id={ids.pl0GCZ}
          enchantmentsRowCards={gameSnapshot.players[0].places.enchantmentsRow.cards}
          GCZCards={gameSnapshot.players[0].places.GCZ.cards}
          rearrange={rearrange}
          draggedOver={dragUpdate.droppableId === ids.pl0GCZ ? dragUpdate : undefined}
        />{" "}
        <Hand id={ids.pl0hand} handCards={gameSnapshot.players[0].places.hand.cards} />
      </div>
    </DragDropContext>
  );
};

// const handleDragEnd = (result: DropResult) => {
//   const sourceId = result.source.droppableId;
//   if (result.destination) {
//     console.log(result.destination.index);
//     const destinationId = result.destination.droppableId;
//     if (destinationId === sourceId) {
//     }
//   }
//   // need to differentiate between dragging to new index
//   // and just droppping into nothing (destination === null)

//   const targetIndex = result.destination?.index;
//   console.log(targetIndex);
//   const { place: sourcePlace } = locate3(sourceId);
//   switch (sourcePlace) {
//     case "hand":
//       dispatch({ type: "SET_HAND_CARD_DRAG", payload: undefined });
//       break;
//     // here assuming that it is player 0, since opponents' GCZ will be disabled
//     case "GCZ":
//       dispatch({
//         type: "END_GCZ_REARRANGE",
//         payload: { targetIndex: targetIndex },
//       });
//   }
//   console.log(result.destination);
// };
