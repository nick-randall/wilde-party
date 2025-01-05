import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
    onBeforeCapture,
    onDragEnd,
    onDragStart,
    onDragUpdate,
} from "../dragEventHandlers/dragEventHandlers";
import { useEffect } from "react";
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
import { locatePlace } from "../helperFunctions/locateFunctions";
import { appendOffsetMap } from "../offsetState/offsetMapSlice";
import EnemyHand from "../gameComponents/EnemyHand";
import { platform } from "os";

interface TableProps {
    gameData: GameData;
    user: User;
}

export const Table: React.FC<TableProps> = ({ gameData, user }) => {
    console.log(user);
    console.log(gameData);
    const dispatch = useDispatch();
    const { wsConnected, wsLoading, wsError } = useSelector((state: RootState) => state.websocket);
    const { activePlayers, currSnapshot: gameSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );
    const { offsetMap } = useSelector((state: RootState) => state.offsetMapState);
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);

    useEffect(() => {
        if (!wsConnected && !wsLoading && !wsError) {
            dispatch(connectWebsocket({ actionOnConnect: joinGame(gameData.id) }));
        }
    }, [dispatch, gameData.id, wsConnected, wsError, wsLoading]);

    const { nonPlayerPlaces } = gameSnapshot;

    const testUpdate = () => {
        const me = currSnapshot.players[0];
        const myHand = me.places["hand"];
        const handCardIndex = 1;
        const myGCZ = me.places.guestCardZone;
        console.log(myHand.cards[0]);
        console.log(myGCZ.cards[0]);
        const change: Change = {
            source: {
                placeId: myHand.id,
                index: handCardIndex,
                numDraggedElements: 1,
            },
            destination: { placeId: myGCZ.id, index: 0 },
        };
        const snapshotUpdateData: SnapshotUpdateData = {
            type: "addDragged",
            playedCardIds: [myHand.cards[handCardIndex].id],
            targetId: myGCZ.id,
        };
        const updater = new SnapshotUpdater(currSnapshot, snapshotUpdateData);
        console.log(updater.getSnapshot().players[0].places.guestCardZone.cards);

        updater.addChange(change);
        updater.begin();
        console.log(updater.getNewSnapshot().players[0].places.guestCardZone.cards);
        dispatch(testUpdateSnapshot(updater.getNewSnapshot()));
    };

    const registerPlaceOffset = (el: HTMLElement | null, id: number) => {
        if (el === null) return;
        const { left, top } = el.getBoundingClientRect();
        const offset = { dx: left, dy: top };
        if (offsetMap[id]) return;
        dispatch(appendOffsetMap({ [id]: offset }));
    };

    const { activeAnimation } = useSelector((state: RootState) => state.gameSnapshotState);
    const { myIndex } = useSelector((state: RootState) => state.userGameState);
    // const gameSnapshot = useOldSnapshot ? currSnapshot : newSnapshot!

    const animations = activeAnimation?.animations ?? [];
    // If activeAnimation is undefined, always show the old Snapshot,
    // otherwise there is a UI flash where the snapshot has updated but
    // th animations haven't been applied yet
    const useOldSnapshot = (id: number) => activeAnimation?.showPrevSnapshot.includes(id) ?? true;
    // Proxy animations' parent is the body, so they are not placed in a Place component
    const proxyAnimations = activeAnimation?.animations.filter((ani) => !ani.placeId) ?? [];

    const players = gameData.players.map((p) => p.id);


    const shiftRight = (myIndex: number, mover: number, group: number[]) => {
        const moverIndex = group.indexOf(mover);
        const initialMove = moverIndex + myIndex;
        return initialMove % group.length;
    };

    const playerZero = shiftRight(myIndex, players[0], players);
    const playerOne = shiftRight(myIndex, players[1], players);
    const playerTwo = shiftRight(myIndex, players[2], players);

    const p0places = gameSnapshot.players[playerZero].places;
    const p1places = gameSnapshot.players[playerOne].places;
    const p2places = gameSnapshot.players[playerTwo].places;

    return (
        <div>
            <DragDropContext
                onDragStart={onDragStart}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
                onBeforeCapture={onBeforeCapture}
            >
                <div className="table-grid background-tile">
                    <PlayerAvatar player={gameSnapshot.players[playerOne]} />
                    <div></div>
                    <PlayerAvatar player={gameSnapshot.players[playerTwo]} />
                    <EnemyHand
                        player={playerOne}
                        id={p1places.hand.id}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <div></div>
                    <EnemyHand
                        player={playerTwo}
                        id={p2places.hand.id}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <SpecialsZone
                        player={playerOne}
                        specialsZoneData={gameSnapshot.players[playerOne].places.specialsZone}
                        alignment="bottom-left"
                        registerPlaceOffset={registerPlaceOffset}
                    />

                    <div className="grid-item center-gap-row">
                        <Deck
                            id={nonPlayerPlaces.deck.id}
                            cards={nonPlayerPlaces.deck.cards}
                            registerPlaceOffset={registerPlaceOffset}
                        />
                        <DiscardPile
                            id={nonPlayerPlaces.discardPile.id}
                            cards={nonPlayerPlaces.discardPile.cards}
                        />
                    </div>
                    <SpecialsZone
                        player={2}
                        specialsZoneData={gameSnapshot.players[playerTwo].places.specialsZone}
                        alignment="bottom-right"
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <EnemyGCZ
                        player={playerOne}
                        id={gameSnapshot.players[playerOne].places.guestCardZone.id}
                        registerPlaceOffset={registerPlaceOffset}
                        alignment="top-left"
                    />

                    <div></div>
                    <EnemyGCZ
                        player={playerTwo}
                        id={gameSnapshot.players[playerTwo].places.guestCardZone.id}
                        registerPlaceOffset={registerPlaceOffset}
                        alignment="top-right"
                    />
                    <div className="grid-item center-column align-start">
                        <button onClick={testUpdate}></button>
                        <SpecialsZone
                            player={playerZero}
                            specialsZoneData={gameSnapshot.players[playerZero].places.specialsZone}
                            alignment=""
                            registerPlaceOffset={registerPlaceOffset}
                        />
                        <NewGCZ
                            player={playerZero}
                            id={p0places.guestCardZone.id}
                            GCZCards={p0places.guestCardZone.cards}
                            registerPlaceOffset={registerPlaceOffset}
                        />
                    </div>
                    <NewHand
                        id={p0places.hand.id}
                        player={playerZero}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <UWZ
                        player={playerZero}
                        id={p0places.unwantedsZone.id}
                        alignment="center-right"
                    />
                </div>
            </DragDropContext>
        </div>
    );
};
