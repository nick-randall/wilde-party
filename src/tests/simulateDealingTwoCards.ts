import handleNewSnapshots from "../animations/handleNewSnapshots";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { RootState } from "../redux/store";

const dealTwoCards = () => (dispatch: Function, getState: () => RootState) => {
  let currentSnapshot = getState().gameSnapshot;

  const snapshotUpdater = new SnapshotUpdater(currentSnapshot, "dealingCards");
  const deckTop: DragSourceData = { containerId: currentSnapshot.nonPlayerPlaces["deck"].id, index: 0, numDraggedElements: 1 };
  const handStart: DragDestinationData = { containerId: currentSnapshot.players[0].places["hand"].id, index: 0 };
  // These shouldn't be called changes! Or else findchanges needs to be renamed
  snapshotUpdater.addChanges(
    { source: deckTop, destination: handStart }, 7
    // { source: deckTop, destination: handStart },
  );
  snapshotUpdater.begin();
  let newSnapshot = snapshotUpdater.getNewSnapshot();

  console.log("after simulating newSnapshot, here it is")
  console.log(newSnapshot)
  // newSnapshot = {...newSnapshot, snapshotUpdateType: "dealingCards"}
  console.log(newSnapshot.snapshotUpdateType);
  
  // dispatch(handleIncomingSnapshots([newSnapshot]));
  dispatch(handleNewSnapshots([newSnapshot]));
};
export default dealTwoCards;
