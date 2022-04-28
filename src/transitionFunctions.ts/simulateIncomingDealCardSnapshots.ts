import { buildTransitionFromChanges } from "../animations/findChanges.ts/buildTransitionFromChanges";
import createTransitionTemplates from "../animations/findChanges.ts/createTransitionTemplatesFromChanges";
import { findChanges } from "../animations/findChanges.ts/findSnapshotChanges";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { addNewGameSnapshots } from "../redux/newSnapshotActions";
import { RootState } from "../redux/store";
import { addTransition } from "../redux/transitionQueueActionCreators";

export const dealInitialHands = () => (dispatch: Function, getState: () => RootState) => {
  const numCardsInHand = 7;
  const numPlayers = getState().gameSnapshot.players.length;
  const delayBetweenCards = 300;
  const delayBetweenPlayers = 2300;
  // const { gameSnapshot } = getState();

  // const dealStartingGuest = (player: number) => {

  //     dispatch(addTransition(newTransition));
  //   } else {
  //     setTimeout(() => dealStartingGuest(player), 10);
  //   }
  // };

  const dealCard = (player: number, firstCard: boolean, id: number) => {
    let currentSnapshot: GameSnapshot;
    if (getState().newSnapshots.length === 0) {
      currentSnapshot = getState().gameSnapshot;
    } else {
      const newSnapshots = getState().newSnapshots;
      const lastSnapshot: NewSnapshot = newSnapshots[newSnapshots.length - 1];
      // convert NewSnaphot to GameSnapshot using destructuring
      const { transitionTemplates, ...lastSnapshotAsGameSnapshot } = lastSnapshot;
      currentSnapshot = lastSnapshotAsGameSnapshot;
    }

    const snapshotUpdater = new SnapshotUpdater(currentSnapshot);
    //const update: SnapshotUpdate = { from: { player: 0, place: "hand", index: 0 }, to: { player: 0, place: "GCZ", index: 1 } };
    const dragSource: DragSourceData = { containerId: currentSnapshot.nonPlayerPlaces["deck"].id, index: 0, numDraggedElements: 1 };
    const dragDestination: DragDestinationData = { containerId: currentSnapshot.players[player].places["hand"].id, index: 0 };
    // These shouldn't be called changes! Or else findchanges needs to be renamed
    snapshotUpdater.addChange({ source: dragSource, destination: dragDestination });
    snapshotUpdater.begin();
    const snapshot = snapshotUpdater.getNewSnapshot();
    let newSnapshot: NewSnapshot;
    if (!firstCard) {
      // Set the phase to playPhase in the newSnapshots, 
      // the playPhase will be automatically updated after ALL snapshots have been animated
      const { current } = snapshot
      const currentWithPlayPhase: Current = {...current, phase: "playPhase"}
      newSnapshot = { ...snapshot, transitionTemplates: [], snapshotUpdateType: "dealingInitialCard", id: id, current: currentWithPlayPhase };
    } else {
      const changes = findChanges({ prevSnapshot: currentSnapshot, newSnapshot: snapshot });
      const templates = createTransitionTemplates(changes, "dealingInitialCard");
      newSnapshot = { ...snapshot, transitionTemplates: templates, snapshotUpdateType: "dealingInitialCard", id: id };
    }
    dispatch(addNewGameSnapshots([newSnapshot]));
  };

  // for (let i = 0; i < numPlayers; i++) dealStartingGuest(i);
  // for(let i = 0; i < 4; i++)
  // dealStartingGuest(0)
  for (let i = 0; i < numPlayers; i++) for (let j = 0; j < numCardsInHand; j++) dealCard(i, i === 0 && j === 0, i * numCardsInHand + (j + 1) + 1);
  //create playPhase snapshot
  // const gameSnapshot = getState().gameSnapshot;
  // const { current } = gameSnapshot;
  // const newSnaphot: NewSnapshot = { ...gameSnapshot, transitionTemplates: [], current: { ...current, phase: "playPhase" } };
  // dispatch(addNewGameSnapshots([newSnaphot]));
};
