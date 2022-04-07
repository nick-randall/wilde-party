import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import SnapshotUpdater, { NewSnapshotChange } from "../helperFunctions/gameSnapshotUpdates/snapshotChanger";
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
  const { gameSnapshot } = getState();

  // if drag of no consequence
  if (!destination || destination === source) {
  }

  if (source && destination) {
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
        const snapshotUpdate: NewSnapshotChange = {
          origin: { containerId: source.containerId, index: source.index },
          destination: { containerId: destination.containerId, index: destination.index },
        };
        snapshotUpdater.addChange(snapshotUpdate);
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
