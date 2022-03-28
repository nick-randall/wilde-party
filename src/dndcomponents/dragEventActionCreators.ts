export type DragAction = SetDraggedId | SetInitialDraggedState | UpdateDragDestination | CleanUpDragState | SetDragContainerExpand;

export type SetDraggedId = {
  type: "SET_DRAGGED_ID";
  payload: string;
};

export type SetInitialDraggedState = {
  type: "SET_INITIAL_DRAGGED_STATE";
  payload: DragSourceData;
};

export type CleanUpDragState = {
  type: "CLEAN_UP_DRAG_STATE";
};

export type SetDragContainerExpand = {
  type: "SET_DRAG_CONTAINER_EXPAND";
  payload: { width: number; height: number };
};

export type UpdateDragDestination = {
  type: "UPDATE_DRAG_DESTINATION";
  payload: { destination: LocationData | undefined };
};


// Action Creators
export const setDraggedId = (id: string): SetDraggedId => ({ type: "SET_DRAGGED_ID", payload: id });

export const setInitialDraggedState = (dragSourceData: DragSourceData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: dragSourceData,
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