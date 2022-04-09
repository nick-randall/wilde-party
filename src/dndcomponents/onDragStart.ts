import { RootState } from "../redux/store";
import { setDraggedId, setInitialDraggedState, setDragContainerExpand, updateDragDestination, cleanUpDragState } from "./dragEventActionCreators";

// Thunks

export const onDragStart =
  (id: string, source: DragSourceData, destination: LocationData, dragContainerExpand: { width: number; height: number }) =>
  (dispatch: Function, getState: () => RootState) => {
    dispatch(setDraggedId(id));
    dispatch(setInitialDraggedState(source, destination));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

