import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { getAllDimensions } from "../helperFunctions/getAllDimensions";
import { locate } from "../helperFunctions/locateFunctions";
import { RootState } from "../redux/store";
import { setNewSnapshot } from "../redux/updateSnapshotActionCreators";
import { cleanUpDragState } from "./dragEventActionCreators";
import { v4 as uuidv4 } from "uuid";
import handleNewSnapshotFromUserAction from "../handleNewSnapshots/handleNewSnapshotFromUserAction";

export const onDragEnd = () => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  const { gameSnapshot } = getState();
  console.log(" start of ondragend");

  // if drag of no consequence
  if (!destination || destination === source) {
    console.log("drag of no consequence");
    dispatch(cleanUpDragState());
    return;
  }
  // if rearrange...not implemented yet
  if (destination.containerId === source?.containerId) {
    const snapshotUpdater = new SnapshotUpdater(gameSnapshot, "rearrangingTablePlace");
    snapshotUpdater.addChange({ source: source, destination: destination });
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

    const snapshotUpdater = new SnapshotUpdater(gameSnapshot, playedCard.action.actionType);
    switch (playedCard.action.actionType) {
      case "addDragged":
        snapshotUpdater.addChange({ source: source, destination: destination });
        snapshotUpdater.begin();
        const newSnapshot = snapshotUpdater.getNewSnapshot();
        dispatch(handleNewSnapshotFromUserAction(newSnapshot));
    }
  }

  dispatch(cleanUpDragState());
};
