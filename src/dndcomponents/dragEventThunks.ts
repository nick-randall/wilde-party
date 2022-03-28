import { RootState } from "../redux/store";
import { cleanUpDragState, setDragContainerExpand, setDraggedId, setInitialDraggedState, updateDragDestination } from "./dragEventActionCreators";

interface LastLocation {
  left: number;
  top: number;
}

// Thunks

export const dragStartThunk =
  (id: string, source: DragSourceData, dragContainerExpand: { width: number; height: number }) => (dispatch: Function, getState: () => RootState) => {
    console.log("drag started")
    dispatch(setDraggedId(id));
    dispatch(setInitialDraggedState(source));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

export const dragUpateThunk = (destinationLocationUpdate : LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate))
};

export const dragEndThunk = (lastLocation: LastLocation) => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  console.log("drag source " + source);
  console.log("drag destination " + destination);
  console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};
