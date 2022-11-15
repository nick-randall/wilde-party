import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
  import { locate } from "../helperFunctions/locateFunctions/locateFunctions";
import { RootState } from "../redux/store";
import { cleanUpDragState } from "./dragEventActionCreators";
import handleNewSnapshotFromUserAction from "../animations/handleNewSnapshotFromUserAction";

export const onDragEnd = (draggedState: DraggedState) => (dispatch: Function, getState: ()=> RootState) => {
  const { source, destination } = draggedState;
  const { gameSnapshot } = getState();
  console.log(" start of ondragend");

  // if drag of no consequence
  if (!destination || destination === source) {
    console.log("drag of no consequence because "+ !destination);
    dispatch(cleanUpDragState());
    return;
  }
  // if rearrange...not implemented yet
  if (destination.containerId === source?.containerId) {
    const snapshotUpdater = new SnapshotUpdater(gameSnapshot, "rearrangingTablePlace");
    snapshotUpdater.addChanges({ source: source, destination: destination }, source.numDraggedElements);
    snapshotUpdater.begin();
    const newSnapshot = snapshotUpdater.getNewSnapshot();
    dispatch(handleNewSnapshotFromUserAction(newSnapshot));
    dispatch(cleanUpDragState());
    return;
  }

  if (source && destination) {
    console.log("in body of ondragend");
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
    console.log(playedCard)

    const snapshotUpdater = new SnapshotUpdater(gameSnapshot, playedCard.action.actionType);
    switch (playedCard.action.actionType) {
      case "addDragged":
        console.log("addDragged")
        console.log(source)
        console.log(destination)
        snapshotUpdater.addChange({ source: source, destination: destination });
        snapshotUpdater.begin();
        const newSnapshot = snapshotUpdater.getNewSnapshot();
        console.log(newSnapshot)
        dispatch(handleNewSnapshotFromUserAction(newSnapshot));
    }
  }

  dispatch(cleanUpDragState());
};
