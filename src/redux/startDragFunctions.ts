
import { DragStart } from "react-beautiful-dnd";
import { getCardRowAndShape } from "../helperFunctions/groupGCZCards";
import { locate } from "../helperFunctions/locateFunctions";
import { StartDrag } from "./actions";
import { RootState } from "./store";

export const getStartDragAction = (stateCopy: RootState, action: StartDrag) => {
  const { droppableId } = action.payload.source;
  const { place: sourcePlace } = locate(droppableId, stateCopy.gameSnapshot);
  console.log(sourcePlace)
  if (sourcePlace === "hand") return doNothing;
  if (sourcePlace === "GCZ") return startGCZRearrangeFunc;
 
   return startRearrangeFunc;
};

const doNothing = (state: RootState, action: DragStart) => state;

const startGCZRearrangeFunc = (stateCopy: RootState, data: DragStart): RootState => {
  const { index } = data.source;
  const { draggableId } = data;
  const { GCZRow, shape } = getCardRowAndShape(stateCopy.gameSnapshot, index);
  stateCopy.GCZRearrangingData = {
    cardRowShape: shape,
    index: shape[index],
    ghostCardsObject: GCZRow.filter(cardGroup => cardGroup.id === draggableId)[0],
  };
  return stateCopy;
};

const startRearrangeFunc = (stateCopy: RootState, data: DragStart): RootState => {
  const sourceIndex = data.source.index;
  const { draggableId } = data;
  const { droppableId } = data.source;
  const { place, player } = locate(droppableId, stateCopy.gameSnapshot);
  if (player) {
    const placeCards = stateCopy.gameSnapshot.players[player].places[place].cards;
    const card = placeCards.filter(e => e.id === draggableId)[0];
    stateCopy.rearrangingData = {
      placeId: droppableId,
      card: card,
      index: sourceIndex,
    };
  } else console.log("player is null");
  return stateCopy;
};


