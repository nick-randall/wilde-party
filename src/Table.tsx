import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { onBeforeCapture, onDragEnd, onDragStart, onDragUpdate } from "./dragEventHandlers/dragEventHandlers";
import { useEffect, useState } from "react";
import "./css/global.css";
import "./css/grid.css";
import axios from "axios";
import { set } from "ramda";
import { Deck } from "./Deck";
import DiscardPile from "./DiscardPile";
import PlayerAvatar from "./PlayerAvatar";
import { SpecialsZone } from "./SpecialsZone";
import EnemyGCZ from "./EnemyGCZ";
import { p } from "./EnemyPlayer";
import GCZ from "./GCZ";
import Hand from "./Hand";
import UWZ from "./UWZ";
import { SET_GAME_SNAPSHOT, SET_SCREEN_SIZE } from "./redux/dragEventReducer";
import { joinChatRoom, SEND_MESSAGE_TO_ROOM } from "./websocket/websocketActionCreators";

export const Table = () => {
  // const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const screenSize = useSelector((state: RootState) => state.dragEventState.screenSize);
  // const { player, plays, draws, rolls, phase } = useSelector((state: RootState) => state.gameSnapshot.current);
  const [gameStarted, setGameStarted] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   window.addEventListener("resize", () => {
  //     dispatch(SET_SCREEN_SIZE());
  //   });
  // });
  useEffect(() => {
    if (!gameStarted) {
      console.log("called it");
      // dispatch(dealInitialHands());
      axios
        .get("/just-get-snapshot")
        // .then(res => res.json())
        .then(resp => {
          console.log("got snapshot");
          dispatch(SET_GAME_SNAPSHOT( resp.data));
          dispatch(SEND_MESSAGE_TO_ROOM("BASDF"))
        });
      setGameStarted(true);
    }
  }, [dispatch, gameStarted]);
  const gameSnapshot = useSelector((state: RootState) => state.dragEventState.gameSnapshot);
  console.log(gameSnapshot);
  if (!gameSnapshot) return <div className="background-tile">loading</div>;
  const { player } = gameSnapshot.current;
  const { nonPlayerPlaces } = gameSnapshot;
  const p01places = gameSnapshot.players[0].places;
  const p02places = gameSnapshot.players[1].places;
  const p03places = gameSnapshot.players[2].places;


  return (
    <div>
      <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd} onBeforeCapture={onBeforeCapture}>
        <div className="table-grid background-tile">
          <PlayerAvatar player={gameSnapshot.players[1]} />
          <div></div>
          <PlayerAvatar player={gameSnapshot.players[2]} />
          <SpecialsZone specialsZoneData={gameSnapshot.players[1].places.specialsZone} alignment="bottom-left" />
          <div className="grid-item center-gap-row">
            <Deck id={nonPlayerPlaces.deck.id} cards={nonPlayerPlaces.deck.cards} />
            <DiscardPile id={nonPlayerPlaces.discardPile.id} cards={nonPlayerPlaces.discardPile.cards} />
          </div>
          <SpecialsZone specialsZoneData={gameSnapshot.players[1].places.specialsZone} alignment="bottom-right" />
          <EnemyGCZ
            id={gameSnapshot.players[1].id}
            enchantmentsRowCards={p02places.enchantmentsRow.cards}
            GCZCards={p02places.guestCardZone.cards}
            alignment="top-left"
          />
          <div></div>
          <EnemyGCZ
            id={gameSnapshot.players[2].id}
            enchantmentsRowCards={p03places.enchantmentsRow.cards}
            GCZCards={p02places.guestCardZone.cards}
            alignment="top-right"
          />
          <div className="grid-item center-column align-start">
            <SpecialsZone specialsZoneData={p01places.specialsZone} alignment="" />
            <GCZ id={p01places.guestCardZone.id} enchantmentsRowCards={p01places.enchantmentsRow.cards} GCZCards={p01places.guestCardZone.cards} />
          </div>
          <Hand id={p01places.hand.id} handCards={p01places.hand.cards} />
          <UWZ id={p01places.unwantedsZone.id} unwantedCards={p01places.unwantedsZone.cards} alignment="center-right"/>
          {/* <Player id={gameSnapshot.players[0].id} screenSize={screenSize} places={gameSnapshot.players[0].places} current={player === 0} />
          <EnemyPlayer id={gameSnapshot.players[1].id} screenSize={screenSize} places={gameSnapshot.players[1].places} current={player === 1} />
          <EnemyPlayer id={gameSnapshot.players[2].id} screenSize={screenSize} places={gameSnapshot.players[2].places} current={player === 2} /> */}
          {/* <UWZ id={ids.pl1UWZ} unwantedCards={gameSnapshot.players[1].places.UWZ.cards} /> */}
        </div>
      </DragDropContext>
    </div>
  );
};
