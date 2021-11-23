import { BeforeCapture, DragDropContext, DraggableLocation, DragStart, DragUpdate, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { locate3 } from "./helperFunctions/locateFunctions";
import { getCardGroupObjs, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { getIdListObject } from "./helperFunctions/getIdList";
import { useState } from "react";

export const Board = () => {
  const dispatch = useDispatch();
  const [rearrange, setRearrange] = useState<SimpleRearrangingData>({ placeId: "", draggableId: "", sourceIndex: -1 });
  const [dragUpdate, setDragUpdate] = useState<UpdateDragData>({ droppableId: "", index: -1 });

  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);

  const handleBeforeCapture = ({ draggableId }: { draggableId: string }) =>
    dispatch({ type: "SET_HAND_CARD_DRAG", payload: gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) });

  const handleDragStart = ({ source, draggableId }: { source: DraggableLocation; draggableId: string }) =>
    setRearrange({ placeId: source.droppableId, sourceIndex: source.index, draggableId });
  //dispatch({ type: "START_DRAG", payload: start });

  //const handleDragUpdate = (d:DragUpdate)({destination} : {destination: DraggableLocation | undefined}) => destination ? setDragUpdate(destination): ()=>{}
  const handleDragUpdate = (d: DragUpdate) => (d.destination ? setDragUpdate(d.destination) : () => {});

  //(update.destination ? dispatch({ type: "UPDATE_DRAG", payload: update.destination }) : null);

  const handleDragEnd = () => {
    setDragUpdate({ droppableId: "", index: -1 });
    setRearrange({ placeId: "", draggableId: "", sourceIndex: -1 });
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <div>
        {" "}
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
