import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { onBeforeCapture, onDragEnd, onDragStart, onDragUpdate } from "../dragEventHandlers/dragEventHandlers";
import { useEffect, useRef } from "react";
import "../css/grid.css";
import { Deck } from "../gameComponents/Deck";
import DiscardPile from "../gameComponents/DiscardPile";
import PlayerAvatar from "../gameComponents/PlayerAvatar";
import { SpecialsZone } from "../gameComponents/SpecialsZone";
import EnemyGCZ from "../gameComponents/EnemyGCZ";
import UWZ from "../gameComponents/UWZ";
import { connectWebsocket, joinGame } from "../websocket/websocketActionCreators";
import { RootState } from "../redux/store";
import NewHand from "../gameComponents/NewHand";
import NewGCZ from "../gameComponents/NewGCZ";
import { testUpdateSnapshot } from "../gameSnapshotState/gameSnapshotSlice";
import SnapshotUpdater, { Change } from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { RefMap } from "../animations/animationHelperFunctions";

interface TableProps {
  gameData: GameData;
}

export const Table: React.FC<TableProps> = ({ gameData }) => {
  const dispatch = useDispatch();
  const { wsConnected, wsLoading, wsError } = useSelector((state: RootState) => state.websocket);
  const { activePlayers, currSnapshot: gameSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);

  useEffect(() => {
    if (!wsConnected && !wsLoading && !wsError) {
      dispatch(connectWebsocket({ actionOnConnect: joinGame(gameData.id) }));
    }
  }, [dispatch, gameData.id, wsConnected, wsError, wsLoading]);

  // useEffect(() => {
  //   dispatch(joinGame(gameData.id));
  // }, [dispatch, gameData.id]);

  // const {gameSnapshot} = useSelector((state: RootState) => state.dragEventState);

  const { nonPlayerPlaces } = gameSnapshot;
  const p01places = gameSnapshot.players[0].places;
  const p02places = gameSnapshot.players[1].places;
  const p03places = gameSnapshot.players[2].places;
  
  const placeRefMap = useRef<RefMap>({});


  const testUpdate = () => {
    const me = currSnapshot.players[0];
    const myHand = me.places["hand"];
    const handCardIndex = 1
    const myGCZ = me.places.guestCardZone;
    console.log(myHand.cards[0])
    console.log(myGCZ.cards[0])
    const change: Change = {
      source: { placeId: myHand.id, index: handCardIndex, numDraggedElements: 1 },
      destination: {placeId: myGCZ.id, index: 0},
    };
    const snapshotUpdateData : SnapshotUpdateData = {
      type: "addDragged",
      playedCardIds :[myHand.cards[handCardIndex].id],
      targetId: myGCZ.id
    }
    const updater = new SnapshotUpdater(currSnapshot, snapshotUpdateData);
    console.log(updater.getSnapshot().players[0].places.guestCardZone.cards)

    updater.addChange(change);
    updater.begin()
    console.log(updater.getNewSnapshot().players[0].places.guestCardZone.cards)
    dispatch(testUpdateSnapshot(updater.getNewSnapshot()));
  };

  return (
    <div>
      <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd} onBeforeCapture={onBeforeCapture}>
        <div className="table-grid background-tile">
          <PlayerAvatar player={gameSnapshot.players[1]} />
          <div></div>
          <PlayerAvatar player={gameSnapshot.players[2]} />
          <SpecialsZone player={1} specialsZoneData={gameSnapshot.players[1].places.specialsZone} alignment="bottom-left" />
          <div className="grid-item center-gap-row">
            <Deck id={nonPlayerPlaces.deck.id} cards={nonPlayerPlaces.deck.cards} />
            <DiscardPile id={nonPlayerPlaces.discardPile.id} cards={nonPlayerPlaces.discardPile.cards} />
          </div>
          <SpecialsZone player={2} specialsZoneData={gameSnapshot.players[1].places.specialsZone} alignment="bottom-right" />
          <EnemyGCZ
            player={1}
            id={gameSnapshot.players[1].places.guestCardZone.id}
            enchantmentsRowCards={p02places.enchantmentsRow.cards}
            GCZCards={p02places.guestCardZone.cards}
            alignment="top-left"
          />
          <div></div>
          <EnemyGCZ
            player={2}
            id={gameSnapshot.players[2].places.guestCardZone.id}
            enchantmentsRowCards={p03places.enchantmentsRow.cards}
            GCZCards={p02places.guestCardZone.cards}
            alignment="top-right"
          />
          <div className="grid-item center-column align-start">
            <button onClick={testUpdate}></button>
            <SpecialsZone player={0} specialsZoneData={p01places.specialsZone} alignment="" />
            <NewGCZ player={0} id={p01places.guestCardZone.id} GCZCards={p01places.guestCardZone.cards} />
          </div>
          <NewHand id={p01places.hand.id} handCards={p01places.hand.cards} />
          <UWZ player={0} id={p01places.unwantedsZone.id} unwantedCards={p01places.unwantedsZone.cards} alignment="center-right" />
          {/* <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current={player === 0} />
          <EnemyPlayer id={gameSnapshot.players[1].id} screenSize={screenSize} places={gameSnapshot.players[1].places} current={player === 1} />
          <EnemyPlayer id={gameSnapshot.players[2].id} screenSize={screenSize} places={gameSnapshot.players[2].places} current={player === 2} /> */}
          {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
        </div>
      </DragDropContext>
    </div>
  );
};
