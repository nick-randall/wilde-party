import { DraggableLocation, DragUpdate, DropResult } from "react-beautiful-dnd";
import { locate } from "../helperFunctions/locateFunctions";
import store from "../redux/store";
import { addDraggedThunk, enchantThunk } from "../redux/thunks";

const isHandCard = (source: DraggableLocation) => locate(source.droppableId).place === "hand";

const cardHasChangedIndex = (d: DropResult) => d.destination && d.destination.index !== d.source.index;

const cardMovedWithinOnePlace = (d: DropResult) => d.destination && d.destination.droppableId === d.source.droppableId;

const isRearrange = (d: DropResult) => cardHasChangedIndex(d) && cardMovedWithinOnePlace(d);

const isEnchant = (d: DropResult, gameSnapshot: GameSnapshot) => {
  const handCard = getDraggedHandCard(gameSnapshot, d.draggableId); 
  return handCard?.action.actionType === "enchant" || handCard?.action.actionType === "enchantWithBff";
};

const isDestroy =  (d: DropResult, gameSnapshot: GameSnapshot) => {
  const handCard = getDraggedHandCard(gameSnapshot, d.draggableId); 
  return handCard?.action.actionType === "destroy";
};

const getDraggedHandCard = (gameSnapshot: GameSnapshot, draggableId: string | undefined) =>
  draggableId ? gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggableId) : undefined;

const cardDidLeaveHand = (d: DropResult) => d.destination && d.destination.droppableId !== d.source.droppableId;

const cardDroppedElswhere = (d: DropResult) => d.destination;

const isAddDrag = (d: DropResult) => cardDidLeaveHand(d) && cardDroppedElswhere(d);


///
export const handleBeforeCapture = ({ draggableId }: { draggableId: string }) =>
  store.dispatch({ type: "SET_DRAGGED_HAND_CARD", payload: draggableId });

export const handleDragStart = ({ source, draggableId }: { source: DraggableLocation; draggableId: string }) => {
  if (isHandCard(source)) store.dispatch({ type: "SET_HIGHLIGHTS", payload: draggableId });
  else {
    store.dispatch({ type: "START_REARRANGING", payload: { placeId: source.droppableId, sourceIndex: source.index, draggableId: draggableId } });
  }
};

export const handleDragUpdate = (d: DragUpdate) =>
  d.destination
    ? store.dispatch({ type: "UPDATE_DRAG", payload: d.destination })
    : store.dispatch({ type: "UPDATE_DRAG", payload: { droppableId: "", index: -1 } });

export const handleDragEnd = (d: DropResult) => {
  const gameSnapshot = store.getState().gameSnapshot;
  if (d.destination) {
    if (isRearrange(d)) store.dispatch({ type: "REARRANGE", payload: { source: d.source, destination: d.destination } });
    else if (isEnchant(d, gameSnapshot)) store.dispatch(enchantThunk(d))//store.dispatch({ type: "ENCHANT", payload: d });
    else if(isDestroy(d,gameSnapshot)) store.dispatch({type: "DESTROY_CARD", payload: d.destination.droppableId })
    else if (isAddDrag(d)) store.dispatch(addDraggedThunk( d.source, d.destination))//store.dispatch({ type: "ADD_DRAGGED", payload: { source: d.source, destination: d.destination } });
  }
  store.dispatch({ type: "END_DRAG_CLEANUP" });
};
