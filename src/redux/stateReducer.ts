import produce from "immer";
import { getCardRowAndShape } from "../helperFunctions/groupGCZCards";
import { locate, locate3 } from "../helperFunctions/locateFunctions";
import { initialGameSnapshot } from "../initialCards";
import { Action } from "./actions";
import { getStartDragAction } from "./startDragFunctions";
import getUpdateDragAction from "./updateDragActions";

export interface State {
  gameSnapshot: GameSnapshot;
  GCZRearrangingData: GCZRearrangingData | undefined;
  rearrangingData: RearrangingData | undefined;
  transitionData: TransitionData[];
  draggedHandCard: GameCard | undefined;
  draggedOverData: DraggedOverData | undefined;
}

export const stateReducer = (
  state: State = {
    gameSnapshot: initialGameSnapshot,
    GCZRearrangingData: undefined,
    rearrangingData: undefined,
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
      console.log(sourcePlace)
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
      const updateDragAction = getUpdateDragAction(state, action);

      let stateCopy2 = { ...state };
      console.log(stateCopy2.GCZRearrangingData);
      stateCopy2 = updateDragAction(state, action.payload);

      return stateCopy2;

    //  case "END_DRAG" :
    //  const
    default:
      return state;
  }
};

export default stateReducer;
