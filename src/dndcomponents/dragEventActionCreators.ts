


// Action Creators
export const setDraggedId = (id: string): SetDraggedId => ({ type: "SET_DRAGGED_ID", payload: id });

export const setInitialDraggedState = (source: DragSourceData, destination: LocationData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: { source: source, destination: destination },
});
export const cleanUpDragState = (): CleanUpDragState => ({ type: "CLEAN_UP_DRAG_STATE" });
export const setDragContainerExpand = (dragContainerExpand: { width: number; height: number }): SetDragContainerExpand => ({
  type: "SET_DRAG_CONTAINER_EXPAND",
  payload: dragContainerExpand,
});
export const updateDragDestination = (destinationLocationUpdate: LocationData | undefined): UpdateDragDestination => ({
  type: "UPDATE_DRAG_DESTINATION",
  payload: { destination: destinationLocationUpdate },
});
