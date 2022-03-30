import { RootState } from "../redux/store";
import { setDraggedId, setInitialDraggedState, setDragContainerExpand, updateDragDestination, cleanUpDragState } from "./dragEventActionCreators";



// Thunks

export const dragStartThunk =
  (id: string, source: DragSourceData, destination: LocationData, dragContainerExpand: { width: number; height: number }) =>
  (dispatch: Function, getState: () => RootState) => {
    console.log(source);
    dispatch(setDraggedId(id));
    dispatch(setInitialDraggedState(source, destination));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

export const dragUpateThunk = (destinationLocationUpdate: LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate));
};

export const dragEndThunk = (lastLocation: LastLocation) => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  // console.log("drag source " + source);
  // console.log("drag destination " + destination);
  // console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};
