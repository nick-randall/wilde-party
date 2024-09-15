import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { onBeforeCapture, onDragEnd, onDragStart, onDragUpdate } from "../dragEventHandlers/dragEventHandlers";
import { useEffect } from "react";
import "../css/grid.css";
import { Deck } from "../gameComponents/Deck";
import DiscardPile from "../gameComponents/DiscardPile";
import PlayerAvatar from "../gameComponents/PlayerAvatar";
import { SpecialsZone } from "../gameComponents/SpecialsZone";
import EnemyGCZ from "../gameComponents/EnemyGCZ";
import GCZ from "../gameComponents/GCZ";
import Hand from "../gameComponents/Hand";
import UWZ from "../gameComponents/UWZ";
import { joinGame } from "../websocket/websocketActionCreators";
import { RootState } from "../redux/store";

interface TableProps {
  gameData: GameData;
}

export const Table: React.FC<TableProps> = ({ gameData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(joinGame(gameData.id));
  }, [dispatch, gameData.id]);

  const gameSnapshot = useSelector((state: RootState) => state.dragEventState.gameSnapshot);

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
          <SpecialsZone player={1} specialsZoneData={gameSnapshot.players[1].places.specialsZone} alignment="bottom-left" />
          <div className="grid-item center-gap-row">
            <Deck id={nonPlayerPlaces.deck.id} cards={nonPlayerPlaces.deck.cards} />
            <DiscardPile id={nonPlayerPlaces.discardPile.id} cards={nonPlayerPlaces.discardPile.cards} />
          </div>
          <SpecialsZone player={2} specialsZoneData={gameSnapshot.players[1].places.specialsZone} alignment="bottom-right" />
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
            <SpecialsZone player={0} specialsZoneData={p01places.specialsZone} alignment="" />
            <GCZ
              player={0}
              id={p01places.guestCardZone.id}
              enchantmentsRowCards={p01places.enchantmentsRow.cards}
              GCZCards={p01places.guestCardZone.cards}
            />
          </div>
          <Hand id={p01places.hand.id} handCards={p01places.hand.cards} />
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
