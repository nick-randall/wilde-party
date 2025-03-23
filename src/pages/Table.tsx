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
import "../css/chat-room.css";
import { Deck } from "../gameComponents/Deck";
import DiscardPile from "../gameComponents/DiscardPile";
import PlayerAvatar from "../gameComponents/PlayerAvatar";
import { SpecialsZone } from "../gameComponents/SpecialsZone";
import EnemyGCZ from "../gameComponents/EnemyGCZ";
import UWZ from "../gameComponents/UWZ";
import { connectWebsocket, joinGame } from "../websocket/websocketActionCreators";
import store, { RootState } from "../redux/store";
import NewHand from "../gameComponents/Hand";
import GCZ from "../gameComponents/GCZ";
import { testUpdateSnapshot } from "../gameSnapshotState/gameSnapshotSlice";
import SnapshotUpdater, { Change } from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { getCard } from "../helperFunctions/locateFunctions";
import { appendOffsetMap } from "../animationState/animationState";
import EnemyHand from "../gameComponents/EnemyHand";
import { getUserPhase } from "../gameSnapshotState/gameSnapshotSelectors";
import { skipToEndOfAnimations, skipToAnimationNumber } from "../animationState/skipAnimations";
import LargeButton from "../components/LargeButton";
import { Center } from "../components/Center";
import AnimatedCard from "../gameComponents/AnimatedCard";
import SmallButton from "../components/SmallButton";
import { setWsError } from "../websocket/websocketSlice";

interface TableProps {
    gameData: GameData;
    user: User;
}

export const Table: React.FC<TableProps> = ({ gameData, user }) => {
    const dispatch = useDispatch();
    const { wsConnected, wsLoading, wsError } = useSelector((state: RootState) => state.websocket);

    const { offsetMap } = useSelector((state: RootState) => state.animationState);

    const phase = useSelector(getUserPhase);

    useEffect(() => {
        if (!wsConnected && !wsLoading && !wsError) {
            dispatch(connectWebsocket({ actionOnConnect: joinGame(gameData.id) }));
        }
    }, [dispatch, gameData.id, wsConnected, wsError, wsLoading]);

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
            },
            destination: { placeId: myGCZ.id, index: 0 },
        };
        const snapshotUpdateData: SnapshotUpdateData = {
            type: "addDragged",
            playedCardIds: [myHand.cards[handCardIndex].id],
            targetId: myGCZ.id,
        };
        const updater = new SnapshotUpdater(currSnapshot);

        updater.addChange(change);
        updater.setSnapshotUpdateData(snapshotUpdateData);
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

    const { currSnapshot, newSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
    const { myIndex } = useSelector((state: RootState) => state.userGameState);

    // If activeAnimation is undefined, always show the old Snapshot,
    // otherwise there is a UI flash where the snapshot has updated but
    // th animations haven't been applied yet
    const whichSnapshot = (id: number) => {
        const showPrevSnapshot = activeAnimation?.showPrevSnapshot.includes(id) ?? true;
        return showPrevSnapshot ? currSnapshot : newSnapshot!;
    };
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

    const nonPlayerPlaces = currSnapshot.nonPlayerPlaces;
    const p0 = currSnapshot.players[playerZero];
    const p1 = currSnapshot.players[playerOne];
    const p2 = currSnapshot.players[playerTwo];

    return (
        <div style={{ width: "100vw" }}>
            {proxyAnimations.map((a) => {
                const { imageName } = getCard(a.cardId, currSnapshot);
                return (
                    <AnimatedCard
                        key={`${a.cardId}-proxy-${a.track}`}
                        id={a.cardId}
                        imageName={imageName}
                        currAnimations={proxyAnimations}
                        gameSnapshot={newSnapshot!}
                    />
                );
            })}
            <img
                src="./icons/fast-forward.png"
                alt=""
                style={{
                    position: "absolute",
                    left: "50vw",
                    height: 50,
                    cursor: "pointer",
                    transition: "300ms",
                    zIndex: 99,
                    opacity: activeAnimation ? 1 : 0,
                }}
                onClick={() => dispatch(skipToEndOfAnimations())}
            />
            <img
                src="./icons/fast-forward.png"
                alt=""
                style={{
                    position: "absolute",
                    left: "55vw",
                    height: 50,
                    cursor: "pointer",
                    transition: "300ms",
                    zIndex: 99,
                    opacity: activeAnimation ? 1 : 0,
                }}
                onClick={() => dispatch(skipToAnimationNumber(4))}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    height: "40%",
                    width: "100%",
                    backgroundColor: "red",
                    opacity: 0.2,
                }}
            ></div>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    height: "60%",
                    width: "50%",
                    backgroundColor: "green",
                    opacity: 0.2,
                }}
            ></div>
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    height: "60%",
                    width: "50%",
                    backgroundColor: "blue",
                    opacity: 0.2,
                }}
            ></div>

            <DragDropContext
                onDragStart={onDragStart}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
                onBeforeCapture={onBeforeCapture}
            >
                <div className="table-grid background-tile">
                    <PlayerAvatar player={p1} />
                    <div></div>
                    <PlayerAvatar player={p2} />
                    <EnemyHand
                        id={p1.places.hand.id}
                        gameSnapshot={whichSnapshot(p1.places.hand.id)}
                        player={playerOne}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <div></div>
                    <EnemyHand
                        id={p2.places.hand.id}
                        player={playerTwo}
                        gameSnapshot={whichSnapshot(p2.places.hand.id)}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <div style={{ position: "relative" }}>
                        <SpecialsZone
                            id={p1.places.specialsZone.id}
                            player={playerOne}
                            gameSnapshot={whichSnapshot(p1.places.specialsZone.id)}
                            alignment="bottom-left"
                            registerPlaceOffset={registerPlaceOffset}
                        />
                        <div style={{ position: "absolute", top: 0 }}>
                            <UWZ
                                player={playerOne}
                                id={p1.places.unwantedsZone.id}
                                alignment="center-left"
                                gameSnapshot={whichSnapshot(p1.places.unwantedsZone.id)}
                                registerPlaceOffset={registerPlaceOffset}
                            />
                        </div>
                    </div>

                    <div className="grid-item center-gap-row">
                        <Deck
                            id={nonPlayerPlaces.deck.id}
                            gameSnapshot={whichSnapshot(nonPlayerPlaces.deck.id)}
                            registerPlaceOffset={registerPlaceOffset}
                        />
                        <DiscardPile
                            id={nonPlayerPlaces.discardPile.id}
                            cards={nonPlayerPlaces.discardPile.cards}
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <SpecialsZone
                            id={p2.places.specialsZone.id}
                            player={playerTwo}
                            gameSnapshot={whichSnapshot(p2.places.specialsZone.id)}
                            alignment="bottom-left"
                            registerPlaceOffset={registerPlaceOffset}
                        />
                        <div style={{ position: "absolute", top: 0 }}>
                            <UWZ
                                player={playerTwo}
                                id={p2.places.unwantedsZone.id}
                                alignment="center-left"
                                gameSnapshot={whichSnapshot(p2.places.unwantedsZone.id)}
                                registerPlaceOffset={registerPlaceOffset}
                            />
                        </div>
                    </div>
                    <EnemyGCZ
                        id={p1.places.guestCardZone.id}
                        gameSnapshot={whichSnapshot(p1.places.guestCardZone.id)}
                        player={playerOne}
                        registerPlaceOffset={registerPlaceOffset}
                        alignment="top-left"
                    />

                    <div></div>
                    <EnemyGCZ
                        id={p2.places.guestCardZone.id}
                        gameSnapshot={whichSnapshot(p2.places.guestCardZone.id)}
                        player={playerTwo}
                        registerPlaceOffset={registerPlaceOffset}
                        alignment="top-left align-start"
                    />
                    <div className="grid-item center-column align-start">
                        {/* <button onClick={testUpdate}></button> */}
                        <GCZ
                            id={p0.places.guestCardZone.id}
                            gameSnapshot={whichSnapshot(p0.places.guestCardZone.id)}
                            player={playerZero}
                            registerPlaceOffset={registerPlaceOffset}
                        />
                        <SpecialsZone
                            player={playerZero}
                            id={p0.places.specialsZone.id}
                            gameSnapshot={whichSnapshot(p0.places.specialsZone.id)}
                            alignment=""
                            registerPlaceOffset={registerPlaceOffset}
                        />
                    </div>
                    <NewHand
                        id={p0.places.hand.id}
                        player={playerZero}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                    <UWZ
                        player={playerZero}
                        id={p0.places.unwantedsZone.id}
                        alignment="center-right"
                        gameSnapshot={whichSnapshot(p1.places.specialsZone.id)}
                        registerPlaceOffset={registerPlaceOffset}
                    />
                </div>
            </DragDropContext>
            {wsError && <ConnectionError error={wsError} />}
            {wsLoading && <div className="loading-overlay">Connecting to Game...</div>}
        </div>
    );
};

const ConnectionError: React.FC<{ error: string }> = ({ error }) => {
    const dispatch = useDispatch();
    const retry = () => {
        const gameId = store.getState().userGameState.gameData?.id;
        if (gameId) {
            dispatch(setWsError(null));
            dispatch(connectWebsocket({ actionOnConnect: joinGame(gameId) }));
        }
    };
    return (
        <div className="loading-overlay">
            <Center>
                Error: {error}
                <div style={{ height: 10 }} />
                <LargeButton text="Re-connect" onClick={retry} />
                <div style={{ height: 10 }} />
                <SmallButton text="Start Over" link="/game" />
            </Center>
        </div>
    );
};
