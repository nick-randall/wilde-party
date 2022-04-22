import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { FunctionComponent, useEffect, useState } from "react";
import Player from "./Player";
import NonPlayerPlaces from "./NonPlayerPlaces";
import { dealInitialHands } from "./thunks/dealInitialCards";
import EnemyPlayer from "./EnemyPlayer";
import "./css/global.css";
import { getCardGroupsObjsnew } from "./helperFunctions/groupGCZCardNew";
import SnapshotUpdater from "./helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import createTransitionTemplates from "./animations/findChanges.ts/createTransitionTemplatesFromChanges";
import { findChanges } from "./animations/findChanges.ts/findSnapshotChanges";
import { addNewGameSnapshots } from "./redux/newSnapshotActions";

interface SimulateNewSnapshotButtonProps {
  currentSnapshot: GameSnapshot;
}

const SimulateNewSnapshotButton: React.FC<SimulateNewSnapshotButtonProps> = ({ currentSnapshot }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    const snapshotUpdater = new SnapshotUpdater(currentSnapshot);
    //const update: SnapshotUpdate = { from: { player: 0, place: "hand", index: 0 }, to: { player: 0, place: "GCZ", index: 1 } };
    const dragSource : DragSourceData = { containerId: currentSnapshot.players[0].places["hand"].id, index: 5, numDraggedElements: 1 }
    const dragDestination: DragDestinationData = {containerId: currentSnapshot.players[2].places["GCZ"].id, index: 1 }
    snapshotUpdater.addChange({source: dragSource, destination: dragDestination});
    snapshotUpdater.begin();
    /**
     * This part will need to be handled by a function
     */
    const newSnapshot = snapshotUpdater.getNewSnapshot();
    const changes = findChanges({prevSnapshot: currentSnapshot, newSnapshot: newSnapshot});
    const transitionTemplates = createTransitionTemplates(changes, "addDragged");

    const newSnapshotComplete = {...newSnapshot, id: currentSnapshot.id + 1, transitionTemplates, snapshotUpdateType: "addDragged" } as NewSnapshot;
    dispatch(addNewGameSnapshots([newSnapshotComplete]));
  };
  return <button onClick={handleClick}>Simulate Incoming NewSnapshots</button>;
};

export default SimulateNewSnapshotButton;

export const Table = () => {
  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const screenSize = useSelector((state: RootState) => state.screenSize);
  const { player, plays, draws, rolls, phase } = useSelector((state: RootState) => state.gameSnapshot.current);
  const [gameStarted, setGameStarted] = useState(false);

  // const draggedState = useSelector((state: RootState) => state.draggedState)
  // const draggerId = useSelector((state: RootState) => state.draggedId)

  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch({ type: "SET_SCREEN_SIZE" });
    });
  });
  useEffect(() => {
    if (!gameStarted) {
      dispatch(dealInitialHands());
      setGameStarted(true);
    }
  }, [dispatch, gameStarted]);

  return (
    <div>
      <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
        <NonPlayerPlaces places={gameSnapshot.nonPlayerPlaces} screenSize={screenSize} />
        {/* numDraggedElements: {draggedState.source?.numDraggedElements}
        sourceIndex: {draggedState.source?.index}
        destinationINdex: {draggedState.destination?.index}
        draggerId: {draggerId} */}
        <SimulateNewSnapshotButton currentSnapshot={gameSnapshot}/>
        <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current={player === 0} />
        <EnemyPlayer id={gameSnapshot.players[1].id} player={1} screenSize={screenSize} places={gameSnapshot.players[1].places} current={player === 1} />
        <EnemyPlayer id={gameSnapshot.players[2].id} player={2} screenSize={screenSize} places={gameSnapshot.players[2].places} current={player === 2} />
        {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
      </DragDropContext>
    </div>
  );
};
