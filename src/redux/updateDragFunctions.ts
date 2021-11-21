import { DragUpdate } from "react-beautiful-dnd";
import { locate3 } from "../helperFunctions/locateFunctions";
import { UpdateDrag } from "./actions";
import { RootState } from "./store";

export const getUpdateDragFunction = (state: RootState, action: UpdateDrag) => {
  if (state.GCZRearrangingData !== undefined) return updateGCZRearrange;
  if (state.draggedHandCard !== undefined) return updateDraggedHandCard;
};

const updateGCZRearrange = (state: RootState, update: DragUpdate) => {
  if (state.GCZRearrangingData && update.destination) {
    const cardRowShape = state.GCZRearrangingData.cardRowShape;
    const newIndex = update.destination.index;
    state.GCZRearrangingData.index = cardRowShape[newIndex];
  }
  return state;
};

// need to distinguish from updateGCZ
const updateDraggedHandCard = (state:RootState, data: DragUpdate) => {

  const sourceId = data.source.droppableId;
  const newPlace = data.destination?.droppableId;
  const newIndex = data.destination?.index;
  const { place: sourcePlace } = locate3(sourceId);
  switch (sourcePlace) {
    case "hand":
      if (newPlace && newIndex)
        dispatch({
          type: "SET_HAND_CARD_DRAGGED_OVER",
          payload: { place: newPlace, index: newIndex },
        });
}
