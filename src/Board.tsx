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

  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);
  const highlights = useSelector((state: RootState) => state.highlights);
  const handleBeforeCapture = ({ draggableId }: { draggableId: string }) => dispatch({ type: "SET_DRAGGED_HAND_CARD", payload: draggableId });

  const isHandCard = (source: DraggableLocation) => locate3(source.droppableId).place === "hand";

  const handleDragStart = ({ source, draggableId }: { source: DraggableLocation; draggableId: string }) => {
    if (isHandCard(source)) dispatch({ type: "SET_HIGHLIGHTS", payload: draggableId });
    else {
      dispatch({ type: "START_REARRANGING", payload: { placeId: source.droppableId, sourceIndex: source.index, draggableId: draggableId } });
    }
  };

  const handleDragUpdate = (d: DragUpdate) =>
    d.destination
      ? dispatch({ type: "UPDATE_DRAG", payload: d.destination })
      : dispatch({ type: "UPDATE_DRAG", payload: { droppableId: "", index: -1 } });

  //(d.destination ? setDragUpdate(d.destination) : () => {});

  const cardHasChangedIndex = (d: DropResult) => d.destination && d.destination.index !== d.source.index;

  const cardMovedWithinOnePlace = (d: DropResult) => d.destination && d.destination.droppableId === d.source.droppableId;

  const isRearrange = (d: DropResult) => cardHasChangedIndex(d) && cardMovedWithinOnePlace(d);

  const isEnchant = (d: DropResult, gameSnapshot: GameSnapshot) => {
    const handCard = getDraggedHandCard(gameSnapshot, d.draggableId); //gameSnapshot.players[0].places.hand.cards.find(c => c.id === d.draggableId);
    return handCard?.action.actionType === "enchant" || handCard?.action.actionType === "enchantWithBff";
  };

  const getDraggedHandCard = (gameSnapshot: GameSnapshot, draggableId: string | undefined) =>
    draggableId ? gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

  const isEnchantWithBFF = (d: DropResult, gameSnapshot: GameSnapshot) => {
    const handCard = getDraggedHandCard(gameSnapshot, d.draggableId); // gameSnapshot.players[0].places.hand.cards.find(c => c.id === d.draggableId);
    return handCard?.action.actionType === "enchantWithBff";
  };

  const cardLeftHand = (d: DropResult) => d.destination && d.destination.droppableId !== d.source.droppableId;

  const cardPlayedToTable = (d: DropResult) => d.destination;

  const isAddDrag = (d: DropResult) => cardLeftHand(d) && cardPlayedToTable(d);

  const handleDragEnd = (d: DropResult) => {
    if (isRearrange(d)) dispatch({ type: "REARRANGE", payload: { source: d.source, destination: d.destination } });
    else if (isEnchant(d, gameSnapshot)) dispatch({ type: "ENCHANT", payload: d });
    //if(isEnchantWithBFF(d, gameSnapshot)) dispatch({type: "ENCHANT"})
    else if (isAddDrag(d)) dispatch({ type: "ADD_DRAGGED", payload: { source: d.source, destination: d.destination } });
    dispatch({ type: "END_DRAG_CLEANUP" });
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
      <div>
        <GCZ
          id={ids.pl0GCZ}
          enchantmentsRowCards={gameSnapshot.players[0].places.enchantmentsRow.cards}
          GCZCards={gameSnapshot.players[0].places.GCZ.cards}
        />
        <Hand id={ids.pl0hand} handCards={gameSnapshot.players[0].places.hand.cards} />
      </div>
    </DragDropContext>
  );
};
