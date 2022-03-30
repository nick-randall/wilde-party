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
  source?: DragSourceData;
  destination?: DragDestinationData;
}

type LastLocation =  {
  left: number;
  top: number;
}

type SetDraggedId = {
  type: "SET_DRAGGED_ID";
  payload: string;
};

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

type DragAction = UpdateDragDestination | SetDragContainerExpand | CleanUpDragState | SetInitialDraggedState | SetDraggedId 