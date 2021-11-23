import produce from "immer";
import { getCardRowAndShape } from "../helperFunctions/groupGCZCards";
import { locate, locate3 } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { getStartDragAction } from "./startDragFunctions";
import getUpdateDragAction, { onNewGCZRearrange } from "./updateDragActions";

export interface State {
  gameSnapshot: GameSnapshot;
  GCZRearrangingData: GCZRearrangingData;
  rearrangingData: RearrangingData;
  transitionData: TransitionData[];
  draggedHandCard: GameCard | undefined;
  draggedOverData: DraggedOverData | undefined;
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    GCZRearrangingData: {ghostCardsObject: , index: -1},
    rearrangingData: {placeId: "", index: -1, card: },
    transitionData: [],
    draggedHandCard: undefined,
    draggedOverData: undefined,
  },
  action: Action
) => {
  switch (action.type) {
    case "START_DRAG":
      let stateCopy = { ...state };
      const { droppableId } = action.payload.source;
      const { place: sourcePlace } = locate(droppableId, stateCopy.gameSnapshot);
      console.log(sourcePlace);
      if (sourcePlace === "GCZ") {
        const { index } = action.payload.source;
        const { draggableId } = action.payload;
        const { GCZRow, shape } = getCardRowAndShape(stateCopy.gameSnapshot, index);
        const GCZRearrangingData = {
          cardRowShape: shape,
          index: shape[index],
          ghostCardsObject: GCZRow.filter(cardGroup => cardGroup.id === draggableId)[0],
        };
        console.log({ ...state, GCZRearrangingData });

        return { ...state, GCZRearrangingData };
      } else return state;

    case "UPDATE_DRAG":
      const { droppableId: targetPlace, index } = action.payload;
      if (locate(targetPlace, state.gameSnapshot).place === "GCZ") {
        return onNewGCZRearrange(state.GCZRearrangingData, action.payload);
      }

      else return {...state, ...action.payload}

    //  case "END_DRAG" :
    //  const
    default:
      return state;
  }
};

export default stateReducer;
