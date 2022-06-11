import { CleanUpDragState, SetDragContainerExpand, SetDragEndTarget, SetInitialDraggedState, UpdateDragDestination } from "../types/dragDataTypes";



// Action Creators
export const setInitialDraggedState = (draggedId: string, source: DragSourceData, destination: LocationData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: { draggedId: draggedId, source: source, destination: destination },
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

export const setDragEndTarget = (x: number, y: number): SetDragEndTarget => ({
  type: "SET_DRAG_END_TARGET",
  payload: { x: x, y: y },
});

export const resetDragEndTarget = (): SetDragEndTarget => ({
  type: "SET_DRAG_END_TARGET",
  payload: undefined,
});