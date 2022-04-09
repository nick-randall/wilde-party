import { RootState } from "../redux/store";
import { updateDragDestination } from "./dragEventActionCreators";

export const onDragUpdate = (destinationLocationUpdate: LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate));
};
