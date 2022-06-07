import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { locate } from "../helperFunctions/locateFunctions";
import { RootState } from "../redux/store";
import { setNewSnapshot } from "../redux/updateSnapshotActionCreators";
import { cleanUpDragState, setDraggedId } from "./dragEventActionCreators";
import { v4 as uuidv4 } from "uuid";
import handleNewSnapshotFromUserAction from "../transitionFunctions/handleNewSnapshotFromUserAction";

export const onDragEnd = (lastLocation: LastLocation) => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  const { gameSnapshot, draggedId } = getState();

  // if drag of no consequence
  if (!destination || destination === source) {
    return;
  }
  // if rearrange...not implemented yet
  if (destination.containerId === source?.containerId) {
    dispatch(setDraggedId(""));
    dispatch(cleanUpDragState());
    // handle rearrange
    return;
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
        snapshotUpdater.addChange({ source: source, destination: destination });
        snapshotUpdater.begin();
        const newSnapshot = snapshotUpdater.getNewSnapshot();
        // NOTE: findChanges() doesn't find changes of index within the same place.
        const [change] = findChanges({ prevSnapshot: gameSnapshot, newSnapshot: newSnapshot });
        if (draggedId) {
          const { xPosition, yPosition } = lastLocation;
          const dimensions: AllDimensions = getAllDimensions(draggedId);
          // const rotation = 0; // handcards shouldn't have a rotation
          // const from: FromWithScreenData = { ...change.from, xPosition, yPosition, dimensions, rotation };
          // const transitionTemplate: TransitionTemplate = { ...change, ...from, orderOfExecution: 0, id: uuidv4(), status: "awaitingEmissaryData" };

          // dispatch(setNewSnapshot({ ...newSnapshot, transitionTemplates: [transitionTemplate] }));

          // TO need to pass lastLocation, dimesions and rotation as an object rather than as individual propertiies
          

          dispatch(handleNewSnapshotFromUserAction(newSnapshot, playedCard.action.actionType, lastLocation, dimensions))
        }
      // dispatch(updateSnapshot(newSnapshot))
    }
  }

  // console.log("drag source " + source);
  // console.log("drag destination " + destination);
  // console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};
