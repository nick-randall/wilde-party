import { RootState } from "../redux/store";
import { setInitialDraggedState, setDragContainerExpand,  } from "./dragEventActionCreators";

// Thunks

export const onDragStart =
  (draggedId: string, source: DragSourceData, destination: LocationData, dragContainerExpand: { width: number; height: number }) =>
  (dispatch: Function, getState: () => RootState) => {
    dispatch(setInitialDraggedState(draggedId, source, destination));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

