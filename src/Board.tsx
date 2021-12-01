import { DragDropContext, DraggableLocation, DragUpdate, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { locate3 } from "./helperFunctions/locateFunctions";
import { getIdListObject } from "./helperFunctions/getIdList";
import { useState } from "react";
import { doNothing } from "./helperFunctions/genericFunctions";

export const Board = () => {
  const dispatch = useDispatch();
  const [rearrange, setRearrange] = useState<SimpleRearrangingData>({ placeId: "", draggableId: "", sourceIndex: -1 });
  const [dragUpdate, setDragUpdate] = useState<UpdateDragData>({ droppableId: "", index: -1 });

  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);
  const highlights = useSelector((state: RootState) => state.highlights);
  const handleBeforeCapture = ({ draggableId }: { draggableId: string }) => dispatch({ type: "SET_DRAGGED_HAND_CARD", payload: draggableId });

  const isHandCard = (source: DraggableLocation) => locate3(source.droppableId).place === "hand";

  const handleDragStart = ({ source, draggableId }: { source: DraggableLocation; draggableId: string }) => {
    if (isHandCard(source)) dispatch({ type: "SET_HIGHLIGHTS", payload: draggableId });
    else {
      dispatch({ type: "ALLOW_REARRANGING", payload: source.droppableId });
      setRearrange({ placeId: source.droppableId, sourceIndex: source.index, draggableId });
    }
  };

  const handleDragUpdate = (d: DragUpdate) => d.destination ? dispatch({type:"UPDATE_DRAG", payload: d.destination}) : doNothing();

  //(d.destination ? setDragUpdate(d.destination) : () => {});

  const cardHasChangedIndex = (d: DropResult) => d.destination && d.destination.index !== d.source.index;

  const cardMovedWithinOnePlace = (d: DropResult) => d.destination && d.destination.droppableId === d.source.droppableId;

  const isRearrange = (d: DropResult) => cardHasChangedIndex(d) && cardMovedWithinOnePlace(d);

  const isEnchant = (d: DropResult, gameSnapshot: GameSnapshot) => {
    const handCard = gameSnapshot.players[0].places.hand.cards.find(c => c.id === d.draggableId);
    return handCard?.action.highlightType === "guestCard";
  };

  const cardLeftHand = (d: DropResult) => d.destination && d.destination.droppableId !== d.source.droppableId;

  const cardPlayedToTable = (d: DropResult) => d.destination;

  const isAddDrag = (d: DropResult) => cardLeftHand(d) && cardPlayedToTable(d);

  const handleDragEnd = (d: DropResult) => {
    if (isRearrange(d)) dispatch({ type: "REARRANGE", payload: { source: d.source, destination: d.destination } });
    if (isEnchant(d, gameSnapshot)) dispatch({ type: "ENCHANT", payload: d });
    if (isAddDrag(d)) dispatch({ type: "ADD_DRAGGED", payload: { source: d.source, destination: d.destination } });
    setDragUpdate({ droppableId: "", index: -1 });
    setRearrange({ placeId: "", draggableId: "", sourceIndex: -1 });
    dispatch({ type: "END_DRAG_CLEANUP" });
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
