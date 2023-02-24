type DragDestinationData = {
  containerId: string;
  index: number;
}

type DragSourceData = {
  containerId: string;
  index: number;
  numDraggedElements?: number
}

type DraggedState = {
  draggedId: string
  source: DragSourceData;
  destination?: DragDestinationData;
} | undefined

type LastLocation =  {
  dx: number;
  dy: number;
}

type SetInitialDraggedState = {
  type: "SET_INITIAL_DRAGGED_STATE";
  payload: DraggedState
};

type CleanUpDragState = {
  type: "CLEAN_UP_DRAG_STATE";
};

type SetDragContainerExpand = {
  type: "SET_DRAG_CONTAINER_EXPAND";
  payload: { width: number; height: number };
};

type UpdateDragDestination = {
  type: "UPDATE_DRAG_DESTINATION";
  payload: { destination: LocationData | undefined };
};

export type SetDragEndTarget = {
  type: "SET_DRAG_END_TARGET";
  payload: DragEndTarget  | undefined;
};

type DragAction = UpdateDragDestination | SetDragContainerExpand | CleanUpDragState | SetInitialDraggedState | SetDraggedId 