import { RootState } from "../redux/store";
import { resetDragEndTarget, setDragEndTarget, updateDragDestination } from "./dragEventActionCreators";

export const onDragUpdate = (destinationLocationUpdate: LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate));
  if (destinationLocationUpdate === undefined) {
    dispatch(resetDragEndTarget());
  }
};
