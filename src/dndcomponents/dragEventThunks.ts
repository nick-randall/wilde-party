import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { locate } from "../helperFunctions/locateFunctions";
import { updateSnapshot } from "../redux/actionCreators";
import { RootState } from "../redux/store";
import { setDraggedId, setInitialDraggedState, setDragContainerExpand, updateDragDestination, cleanUpDragState } from "./dragEventActionCreators";

// Thunks

export const dragStartThunk =
  (id: string, source: DragSourceData, destination: LocationData, dragContainerExpand: { width: number; height: number }) =>
  (dispatch: Function, getState: () => RootState) => {
    dispatch(setDraggedId(id));
    dispatch(setInitialDraggedState(source, destination));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

export const dragUpateThunk = (destinationLocationUpdate: LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate));
};

export const dragEndThunk = (lastLocation: LastLocation) => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  const { gameSnapshot, draggedId } = getState();

  // if drag of no consequence
  if (!destination || destination === source) {
  }

  if (source && destination) {

    // if(isRearrange){// TODO: rearrange of GCZ 
    const { numDraggedElements } = source;
    // currently passing the id of the first card in the cardGrouObj
    // This can be confusing and should be changed if, for example,
    // I change the draggedState to include player and place
    // In which case I would not need to use the locate method
    // }
    const { player: sourcePlayer, place: sourcePlace } = locate(source.containerId, gameSnapshot);

    let playedCard: GameCard;
    if (sourcePlayer === null) {
      playedCard = gameSnapshot.nonPlayerPlaces[sourcePlace].cards[destination.index];
    } else {
      playedCard = gameSnapshot.players[sourcePlayer].places[sourcePlace].cards[destination.index];
    }

    const snapshotUpdater = new SnapshotUpdater(gameSnapshot);

    switch (playedCard.action.actionType) {
      case "addDragged":
        snapshotUpdater.addChange({source: source, destination: destination});
        snapshotUpdater.begin();
        const newSnapshot = snapshotUpdater.getNewSnapshot();
        dispatch(updateSnapshot(newSnapshot));
    }
  }

  // console.log("drag source " + source);
  // console.log("drag destination " + destination);
  // console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};
