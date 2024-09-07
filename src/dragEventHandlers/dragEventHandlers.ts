import { BeforeCapture, DraggableLocation, DragUpdate, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { locate } from "../helperFunctions/locateFunctions";
import store from "../redux/store";
import { addDraggedThunk } from "../redux/thunks";
import { END_DRAG_CLEANUP, REARRANGE, START_REARRANGING, UPDATE_DRAGGED_OVER } from "../redux/dragEventReducer";

const isHandCard = (sourceId: number) => locate(sourceId).place === "hand";

const cardHasChangedIndex = (d: DropResult) => d.destination && d.destination.index !== d.source.index;

const cardMovedWithinOnePlace = (d: DropResult) => d.destination && d.destination.droppableId === d.source.droppableId;

const isRearrange = (d: DropResult) => cardHasChangedIndex(d) && cardMovedWithinOnePlace(d);

const isEnchant = (d: DropResult, gameSnapshot: GameSnapshot) => {
  const handCard = getDraggedHandCard(gameSnapshot, parseInt(d.draggableId));
  return handCard?.action.actionType === "enchant" || handCard?.action.actionType === "enchantWithBff";
};

const isDestroy = (d: DropResult, gameSnapshot: GameSnapshot) => {
  const handCard = getDraggedHandCard(gameSnapshot, parseInt(d.draggableId));
  return handCard?.action.actionType === "destroy";
};

const getDraggedHandCard = (gameSnapshot: GameSnapshot, draggableId: number | undefined) =>
  draggableId ? gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const cardDidLeaveHand = (d: DropResult) => d.destination && d.destination.droppableId !== d.source.droppableId;

const cardDroppedElswhere = (d: DropResult) => d.destination;

const isAddDrag = (d: DropResult) => cardDidLeaveHand(d) && cardDroppedElswhere(d);

///
export const onBeforeCapture = (source: BeforeCapture) => store.dispatch({ type: "SET_DRAGGED_HAND_CARD", payload: source.draggableId });

export const onDragStart = ({ source, draggableId }: { source: DraggableLocation; draggableId: string }) => {
  const draggableData: DraggableData = JSON.parse(draggableId);
  const droppableData: DroppableData = JSON.parse(source.droppableId);
  if (isHandCard(droppableData.id)) store.dispatch({ type: "SET_HIGHLIGHTS", payload: draggableId });
  else {
    store.dispatch(
      START_REARRANGING({
        placeId: droppableData.id,
        sourceIndex: source.index,
        draggedId: draggableData.id,
      })
    );
  }
};

export const onDragUpdate = (dragUpdate: DragUpdate) => {
  let draggedOverData: DraggedOverData | undefined;
  if (dragUpdate.destination) {
    const droppableData: DroppableData = JSON.parse(dragUpdate.destination.droppableId);
    const { id, type, calculatedIndex } = droppableData;
    const index = calculatedIndex ?? dragUpdate.destination.index;
    draggedOverData = { type, id, index };
  } else {
    draggedOverData = undefined;
  }
  store.dispatch(UPDATE_DRAGGED_OVER(draggedOverData));
};

export const onDragEnd = (d: DropResult) => {
  const { source, destination } = d;

  if (destination) {
    const sourceData: DroppableData = JSON.parse(source.droppableId);
    const destinationData: DroppableData = JSON.parse(destination.droppableId);
    const { type: sourceType, id: sourceId } = sourceData;
    const { type: destinationType, id: destinationId } = destinationData;
    const sourceResult = { id: sourceId, type: sourceType, index: source.index };
    const destResult = { id: destinationId, type: destinationType, index: destination.index };
    console.log(sourceResult, destResult);
    if (isRearrange(d)) store.dispatch(REARRANGE({source: sourceResult, destination: destResult}));
    // else if (isEnchant(d, gameSnapshot)) store.dispatch(enchantThunk({ source: d.source, destination: d.destination }));
    // else if (isDestroy(d, gameSnapshot)) store.dispatch(destroyCardThunk({ source: d.source, destination: d.destination }));
    else if (isAddDrag(d)) store.dispatch(addDraggedThunk(sourceResult, destResult));
  }
  store.dispatch(END_DRAG_CLEANUP());
};
