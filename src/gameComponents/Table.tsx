import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { handleBeforeCapture, handleDragEnd, handleDragStart, handleDragUpdate } from "../dragEventHandlers/dragEventHandlers";
import Player from "./Player";
import NonPlayerPlaces from "./NonPlayerPlaces";
import "../css/global.css";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { useEffect, useState } from "react";
import { dealInitialHands } from "../simulateIncomingSnapshots/simulateIncomingDealCardSnapshots";
import dealTwoCards from "../tests/simulateDealingTwoCards";
import handleNewSnapshots from "../animations/handleNewSnapshots";
import EnemyPlayer from "./EnemyPlayer";

interface SimulateNewSnapshotButtonProps {
  currentSnapshot: GameSnapshot;
}

const SimulateNewSnapshotButton: React.FC<SimulateNewSnapshotButtonProps> = ({ currentSnapshot }) => {
  const dispatch = useDispatch();
  const newSnapshotcurrent = useSelector((state: RootState) => state.newSnapshots);
  const animationTemplates = useSelector((state: RootState) => state.animationTemplates);
  const logNewSnapshot = () => {
    console.log(newSnapshotcurrent);
  };
  const logAnimationTemplates = () => {
    console.log(animationTemplates);
  };

  const removeAllNewSnapshots = () => {

  }

  const simulateHandToGCZ = () => {
    const snapshotUpdater = new SnapshotUpdater(currentSnapshot, "addDragged");
    const dragSource: DragSourceData = { containerId: currentSnapshot.players[2].places["hand"].id, index: 0, numDraggedElements: 1 };
    const dragDestination: DragDestinationData = { containerId: currentSnapshot.players[2].places["GCZ"].id, index: 0 };
    snapshotUpdater.addChange({ source: dragSource, destination: dragDestination });
    snapshotUpdater.begin();
    const newSnapshotWithoutUpdateType = snapshotUpdater.getNewSnapshot();
    const newSnapshot: GameSnapshot = {...newSnapshotWithoutUpdateType, snapshotUpdateType: "addDragged"}
    dispatch(handleNewSnapshots([newSnapshot]));
  };

  const simulateDestroy = () => {
    const changes: DraggedResult[] = [];
    let playedFromHandSource: DragSourceData = { containerId: currentSnapshot.players[1].places["hand"].id, index: 0, numDraggedElements: 1 };
    let playedFromHandDestination: DragDestinationData = { containerId: currentSnapshot.nonPlayerPlaces["discardPile"].id, index: 0 };
    const change1 = { source: playedFromHandSource, destination: playedFromHandDestination };
    changes.push(change1);

    const destroyedGCZCardSource: DragSourceData = { containerId: currentSnapshot.players[0].places["GCZ"].id, index: 2, numDraggedElements: 1 };
    const destroyedGCZCardDestination: DragDestinationData = { containerId: currentSnapshot.nonPlayerPlaces["discardPile"].id, index: 1 };
    const change2 = { source: destroyedGCZCardSource, destination: destroyedGCZCardDestination };
    changes.push(change2);

    const snapshotUpdater = new SnapshotUpdater(currentSnapshot, "destroy");
    snapshotUpdater.addChangesFromDifferentPlaces(changes);
    snapshotUpdater.begin();
    const newSnapshotWithoutUpdateType = snapshotUpdater.getNewSnapshot();
    const newSnapshot: GameSnapshot = {...newSnapshotWithoutUpdateType, snapshotUpdateType : "destroy"}
    console.log(newSnapshot)

    dispatch(handleNewSnapshots([newSnapshot]));

  };

  const dealTwoCardsNow = () => dispatch(dealTwoCards());



  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={simulateHandToGCZ}>Simulate HandtoGcz</button>
      {/* <button onClick={simulateDestroy}>Simulate destroy!</button> */}
      <button onClick={logNewSnapshot} style={{color: newSnapshotcurrent === undefined ? "red" : "black"}}>Log New Snapshots NEw version</button>
      <button onClick={logAnimationTemplates}>Log Animation Templates</button>

      <button onClick={dealTwoCardsNow}>Deal Two Cards</button>

      
    </div>
  );
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

  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard?.name)
  const dragEndTarget = useSelector((state: RootState) => state.dragEndTarget)
  const newSnapshots = useSelector((state: RootState) => state.newSnapshots);

  return (
    <div id="table" style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
      <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd} onBeforeCapture={handleBeforeCapture}>
        {/* numDraggedElements: {draggedState.source?.numDraggedElements}
        sourceIndex: {draggedState.source?.index}
        destinationINdex: {draggedState.destination?.index}
        draggerId: {draggerId} */}
        {/* draggedHandCard: {draggedHandCard}
        DRAGENDTARGET: {dragEndTarget ? dragEndTarget.x : "undefined"} */}
        <EnemyPlayer
          id={gameSnapshot.players[1].id}
          player={1}
          screenSize={screenSize}
          places={gameSnapshot.players[1].places}
          current={player === 1}
        />
        <NonPlayerPlaces places={gameSnapshot.nonPlayerPlaces} screenSize={screenSize} />
        <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current={player === 0} />
        <EnemyPlayer
          id={gameSnapshot.players[2].id}
          player={2}
          screenSize={screenSize}
          places={gameSnapshot.players[2].places}
          current={player === 2}
        />


       
        
        
       
        {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
      </DragDropContext>
    </div>
  );
};
