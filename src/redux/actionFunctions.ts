import { DragStart } from "react-beautiful-dnd";
import { getCardGroupObjs, getCardRowShapeOnRearrange } from "../helperFunctions/groupGCZCards";
import { locate3 } from "../helperFunctions/locateFunctions";
import { Action, StartDrag } from "./actions";
import { RootState } from "./store";

export const getStartDragAction = (action: StartDrag) => {
  const { place: sourcePlace } = locate3(action.payload.source.droppableId);
  if (sourcePlace === "GCZ") return startGCZRearrangeFunc;
  if (sourcePlace === "hand") return;
  else return getStartRearrangeFunc;
};

const startGCZRearrangeFunc = (state: RootState, data: DragStart): RootState => {
  const sourceIndex = data.source.index;
  const draggableId = data.draggableId;
  const GCZCards = state.gameSnapshot.players[0].places.GCZ.cards;
  const enchantmentsRow = state.gameSnapshot.players[0].places.enchantmentsRow;
  const GCZRow = getCardGroupObjs(enchantmentsRow.cards, GCZCards);
  const GCZRowShape = getCardRowShapeOnRearrange(GCZRow, sourceIndex);
  state.GCZRearrangingData = {
    cardRowShape: GCZRowShape,
    index: GCZRowShape[sourceIndex],
    ghostCardsObject: GCZRow.filter(cardGroup => cardGroup.id === draggableId)[0],
  };
  return state;
};

const getStartRearrangeFunc = (state: RootState, data: DragStart): RootState => {
  const sourceIndex = data.source.index;
  const draggableId = data.draggableId;
  const droppableId = data.source.droppableId;
  const { place, player } = locate3(droppableId);
  if (player) {
    const placeCards = state.gameSnapshot.players[player].places[place].cards;
    const card = placeCards.filter(e => e.id === draggableId)[0];
    state.rearrangingData = {
      placeId: droppableId,
      card: card,
      index: sourceIndex,
    };
  } else console.log("player is null")
  return state;
};
