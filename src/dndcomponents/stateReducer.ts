
export interface Snapshot {
  [id: string]: GameCard[];
}

interface State {
  draggedId?: string;
  draggedState: DraggedState;
  dragContainerExpand: { width: number; height: number };
  // snapshot: Snapshot;
}

type UpdateSnapshot = {
  type: "UPDATE_SNAPSHOT";
  payload: Snapshot;
};



// const initialDragState = {
//   draggedId: undefined,
//   draggedState: { source: undefined, destination: undefined },
//   dragContainerExpand: { width: 0, height: 0 },
// };

// export const stateReducer = (state: State = initialDragState, action: DragAction) => {
//   switch (action.type) {
//     case "SET_DRAGGED_ID":
//       return { ...state, draggedId: action.payload };
//     case "SET_INITIAL_DRAGGED_STATE": {
//       return { ...state, draggedState: { source: action.payload, destination: action.payload, isInitialRearrange: true } };
//     }
//     case "UPDATE_DRAG_DESTINATION":
//       const { destination } = action.payload;
//       return { ...state, draggedState: { ...state.draggedState, destination: destination, isInitialRearrange: false } };
//     case "CLEAN_UP_DRAG_STATE":
//       return {
//         ...state,
//         draggedState: initialDragState.draggedState,
//         draggedId: initialDragState.draggedId,
//         dragContainerExpand: initialDragState.dragContainerExpand,
//       };
//     case "SET_DRAG_CONTAINER_EXPAND":
//       return { ...state, dragContainerExpand: action.payload };
//     default:
//       return state;
//   }
// };
