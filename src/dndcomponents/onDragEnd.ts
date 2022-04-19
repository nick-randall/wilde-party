import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { locate } from "../helperFunctions/locateFunctions";
import { RootState } from "../redux/store";
import { setNewSnapshot, updateSnapshot } from "../redux/updateSnapshotActionCreators";
import { cleanUpDragState, setDraggedId } from "./dragEventActionCreators";

export const onDragEnd = (lastLocation: LastLocation) => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  const { gameSnapshot, draggedId } = getState();

  // if drag of no consequence
  if (!destination || destination === source) {
  }

  if (source && destination) {

    // if(isRearrange){// TODO: rearrange of GCZ 
    // rearrange of GCZ has to use snapshotupdater.addchanges() --plural
    const { numDraggedElements } = source;
    // currently passing the id of the first card in the cardGrouObj
    // This can be confusing and should be changed if, for example,
    // I change the draggedState to include player and place
    // In which case I would not need to use the locate method
    // }
    const { player: sourcePlayer, place: sourcePlace } = locate(source.containerId, gameSnapshot);

    let playedCard: GameCard;
    if (sourcePlayer === null) {
      playedCard = gameSnapshot.nonPlayerPlaces[sourcePlace].cards[source.index];
    } else {
      playedCard = gameSnapshot.players[sourcePlayer].places[sourcePlace].cards[source.index];
    }

    const snapshotUpdater = new SnapshotUpdater(gameSnapshot);
    switch (playedCard.action.actionType) {
      case "addDragged":
        snapshotUpdater.addChange({source: source, destination: destination});
        snapshotUpdater.begin();
        const newSnapshot = snapshotUpdater.getNewSnapshot();
        // Oh no! findChanges() doesn't seem to find changes of index within the same place... :(
        const [change] = findChanges({prevSnapshot: gameSnapshot, newSnapshot: newSnapshot});
        const {xPosition, yPosition} = lastLocation
        // change.from = {...change.from, xPosition, yPosition };
        console.log(change)
        dispatch(setNewSnapshot(newSnapshot, [change]));
        dispatch(updateSnapshot(newSnapshot))
    }
  }

  // console.log("drag source " + source);
  // console.log("drag destination " + destination);
  // console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};
