import { BeforeCapture, DraggableLocation, DragUpdate, DropResult } from "react-beautiful-dnd";
import { locatePlace } from "../helperFunctions/locateFunctions";
import store from "../redux/store";
import {
    END_DRAG_CLEANUP,
    SET_DRAGGABLE_DATA,
    SET_DRAGGED_HAND_CARD,
    SET_HIGHLIGHTS,
    START_REARRANGING,
    UPDATE_DRAGGED_OVER,
} from "../redux/dragEventSlice";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { sendGameMessage } from "../websocket/websocketActionCreators";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    getCardRowShapeOnRearrange,
} from "../helperFunctions/groupGCZCards";

export const dragEnd = (d: DropResult) => ({ type: "dragEnd", payload: d });

///
export const onBeforeCapture = (source: BeforeCapture) => {
    // This prevents scrolling off the screen and the screen draggin along
    // with it.
    const body = document.getElementsByTagName("body");
    body[0].style.position = "fixed";
    store.dispatch(
        SET_DRAGGED_HAND_CARD({
            gameSnapshot: store.getState().gameSnapshotState.currSnapshot,
            draggedCardId: source.draggableId,
        })
    );
};

export const onDragStart = ({
    source,
    draggableId,
}: {
    source: DraggableLocation;
    draggableId: string;
}) => {
    const draggableData: DraggableData = JSON.parse(draggableId);
    const droppableData: DroppableData = JSON.parse(source.droppableId);
    store.dispatch(SET_DRAGGABLE_DATA(draggableData));
    const currSnapshot = store.getState().gameSnapshotState.currSnapshot;
    if (droppableData.placeType === "hand") {
        store.dispatch(SET_HIGHLIGHTS(currSnapshot));
    } else {
        store.dispatch(
            START_REARRANGING({
                placeId: droppableData.id,
                sourceIndex: source.index,
                draggedId: draggableData.id,
            })
        );
    }
};

export const onDragUpdate = (dragUpdate: DragUpdate) => {
    let draggedOverData: DroppableData | undefined;
    if (dragUpdate.destination) {
        const droppableData: DroppableData = JSON.parse(dragUpdate.destination.droppableId);
        const { id, type, enchantableNeighbours, placeType, player } = droppableData;
        let { calculatedIndex } = droppableData;
        if (type === "place" && placeType === "guestCardZone" && player !== undefined) {
            const GCZCards =
                store.getState().gameSnapshotState.currSnapshot.players[player].places.guestCardZone
                    .cards;
            const cardRow = getCardGroupsObjs(GCZCards);
            const cardRowShape = getCardRowShapeOnDraggedOver(cardRow);
            calculatedIndex = cardRowShape[dragUpdate.destination.index];
        }
        const index = dragUpdate.destination.index;
        draggedOverData = {
            type,
            id,
            index,
            calculatedIndex,
            enchantableNeighbours,
            placeType,
            player,
        };
    } else {
        draggedOverData = undefined;
    }
    store.dispatch(
        UPDATE_DRAGGED_OVER({
            draggedOverData,
            gameSnapshot: store.getState().gameSnapshotState.currSnapshot,
        })
    );
};

export const onDragEnd = (d: DropResult) => {
    const body = document.getElementsByTagName("body");
    body[0].style.position = "initial";
    const { source, destination } = d;
    const draggedOverData = store.getState().dragEventState.draggedOver;

    if (destination && draggedOverData) {
        const draggableData = store.getState().dragEventState.draggableData;
        const sourceData: DroppableData = JSON.parse(source.droppableId);
        const destinationData: DroppableData = JSON.parse(destination.droppableId);
        const { type: destinationType, id: destinationId } = destinationData;
        const destResult = { id: destinationId, type: destinationType, index: destination.index };
        // if (isRearrange(d)) store.dispatch(REARRANGE({ source: sourceResult, destination: destResult }));
        // else if (isEnchant(d, gameSnapshot)) store.dispatch(enchantThunk({ source: d.source, destination: d.destination }));
        // else if (isDestroy(d, gameSnapshot)) store.dispatch(destroyCardThunk({ source: d.source, destination: d.destination }));
        // else
        const gameSnapshot = store.getState().gameSnapshotState.currSnapshot;
        const draggedHandCard = store.getState().dragEventState.draggedHandCard;
        const numDraggedElements = draggableData?.type === "cardGroup" ? draggableData.numCards : 1;

        if (sourceData.id === destinationData.id && draggedOverData) {
            handleRearrange(sourceData, draggedOverData, gameSnapshot, draggableData);
            return;
        }

        if (!draggedHandCard) return; // What about rearrange?
        const { actionResultsMap } = gameSnapshot;
        if (!actionResultsMap)
            throw Error("No action results map in gameSnapshot's actionResultsMap");
        const actionResults = actionResultsMap[draggedHandCard.id];
        const actionResult = actionResults.find(
            (res) => res.snapshotUpdateData.targetId === destinationId
        );

        if (!actionResult) throw Error("No action result found for this drop!");
        const snapshotUpdater = new SnapshotUpdater(gameSnapshot);

        if (draggedOverData.type === "cardGroup") {
            const { id, placeType, player } = destinationData;
            let { calculatedIndex } = draggedOverData;

            if (!placeType || calculatedIndex === undefined || player === undefined) {
                throw Error("No place type or calculated Index in CardGroup Droppable Data! ");
            }

            // Handle bff placed on the right-hand card of the pair
            if (draggedHandCard.cardType === "bff" && placeType === "guestCardZone") {
                const { snapshotUpdateData } = actionResult;
                if (snapshotUpdateData.secondaryCardId !== null) {
                    calculatedIndex -= 1;
                }
            }

            const placeId = player
                ? gameSnapshot.nonPlayerPlaces[placeType].id
                : gameSnapshot.players[player].places[placeType].id;

            snapshotUpdater.addChange({
                destination: { placeId, index: calculatedIndex },
                source: {
                    placeId: sourceData.id,
                    index: source.index,
                },
            });
            const snapshotUpdateData: SnapshotUpdateData = {
                type: draggedHandCard.cardType === "bff" ? "enchantWithBff" : "enchant",
                targetId: destinationId,
                playedCardIds: [draggedHandCard.id],
            };
            snapshotUpdater.setSnapshotUpdateData(snapshotUpdateData);
        } else if (destResult.type === "place") {
            if (draggedOverData.index === undefined) throw Error("No index in draggedOverData");
            snapshotUpdater.addChange({
                destination: {
                    placeId: destinationId,
                    index: draggedOverData.calculatedIndex ?? 0,
                },
                source: {
                    placeId: sourceData.id,
                    index: sourceData.calculatedIndex ?? source.index,
                },
            });
            const snapshotUpdateData: SnapshotUpdateData = {
                type: "addDragged",
                targetId: destinationId,
                playedCardIds: [draggedHandCard.id],
            };
            snapshotUpdater.setSnapshotUpdateData(snapshotUpdateData);
        }

        snapshotUpdater.begin();
        const updatedSnapshot = snapshotUpdater.getNewSnapshot();
        const { gameData } = store.getState().userGameState;
        if (!gameData) throw Error("No game data in userGameState");
        store.dispatch({ type: "HANDLE_NEW_CLIENT_SNAPSHOT", payload: updatedSnapshot });
        store.dispatch(sendGameMessage(gameData.id, updatedSnapshot));
    }
    store.dispatch(END_DRAG_CLEANUP());
};
function handleRearrange(
    sourceData: DroppableData,
    draggedOverData: DroppableData,
    gameSnapshot: GameSnapshot,
    draggableData?: DraggableData
) {
    const rearrangingData = store.getState().dragEventState.rearrangingData;
    const numDraggedElements = draggableData?.numCards || 1;
    const { placeType, player } = locatePlace(sourceData.id, gameSnapshot);

    // Okay I'm doing what I swore I wouldn't -- solve the sourceIndex by re-creating the cardRowShape
    if (placeType !== "guestCardZone" || player === null) {
        throw Error("Not a guestCardZone or player not found");
    }
    if (draggedOverData.index === undefined) {
        throw Error("No dragged over index!");
    }
    const cardRow = getCardGroupsObjs(gameSnapshot.players[player].places.guestCardZone.cards);
    const cardRowShape = getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex);
    const sourceIndex = cardRowShape[rearrangingData.sourceIndex];
    const destinationIndex = cardRowShape[draggedOverData.index];

    const playedCards = gameSnapshot.players[player].places[placeType].cards.slice(
        sourceIndex,
        sourceIndex + numDraggedElements
    );
    const snapshotUpdateData: SnapshotUpdateData = {
        type: "rearrangingTablePlace",
        playedCardIds: playedCards.map((c) => c.id),
        targetId: draggedOverData.id,
    };

    const snapshotUpdater = new SnapshotUpdater(gameSnapshot);
    snapshotUpdater.addChangeWithMultipleCards(
        {
            source: { placeId: sourceData.id, index: sourceIndex },
            destination: { placeId: sourceData.id, index: destinationIndex },
        },
        numDraggedElements
    );
    snapshotUpdater.setSnapshotUpdateData(snapshotUpdateData);
    snapshotUpdater.begin();

    const updatedSnapshot = snapshotUpdater.getNewSnapshot();
    const { gameData } = store.getState().userGameState;
    if (!gameData) throw Error("No game data in userGameState");
    store.dispatch({ type: "HANDLE_NEW_CLIENT_SNAPSHOT", payload: updatedSnapshot });
    store.dispatch(sendGameMessage(gameData.id, updatedSnapshot));
    store.dispatch(END_DRAG_CLEANUP());
}
