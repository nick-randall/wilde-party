import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { RootState } from "../redux/store";
import handleNewSnapshots from "../animations/handleNewSnapshots";

const dealHand = (currentSnapshot: GameSnapshot, player: number) => {
  ///
  const numCardsInHand = 7;

  const snapshotUpdater = new SnapshotUpdater(currentSnapshot, "dealingCards");
  const deckTop: DragSourceData = { containerId: currentSnapshot.nonPlayerPlaces["deck"].id, index: 0, numDraggedElements: 1 };
  const handStart: DragDestinationData = { containerId: currentSnapshot.players[player].places["hand"].id, index: 0 };
  snapshotUpdater.addChanges({ source: deckTop, destination: handStart }, numCardsInHand);
  snapshotUpdater.begin();
  snapshotUpdater.setPhase("playPhase");
  let newSnapshot = snapshotUpdater.getNewSnapshot();
  return newSnapshot;
  ///
};

export const dealInitialHands = () => (dispatch: Function, getState: () => RootState) => {
  const numPlayers = getState().gameSnapshot.players.length;

  let currentSnapshot = getState().gameSnapshot;
  const newSnapshotList = [];

  // for (let i = numPlayers - 1; i > -1; i--) {
    for (let i = 0; i  <numPlayers ; i++) {

    const newSnapshot = dealHand(currentSnapshot, i);
    newSnapshotList.push(newSnapshot);
    currentSnapshot = newSnapshot;
  }
  dispatch(handleNewSnapshots(newSnapshotList));

};
