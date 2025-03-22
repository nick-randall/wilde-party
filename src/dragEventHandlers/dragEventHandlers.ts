import { BeforeCapture, DraggableLocation, DragUpdate, DropResult } from "react-beautiful-dnd";
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
import { getCardGroupsObjs, getCardRowShapeOnDraggedOver } from "../helperFunctions/groupGCZCards";
import {
    handleAddDragged,
    DragEndData,
    handleEnchant,
    handleRearrange,
} from "./handleClientSnapshotUpdates";

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
            calculatedIndex,
            index,
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
    // Prevent window scrolling when dragging off-screen
    const body = document.getElementsByTagName("body");
    body[0].style.position = "initial";

    const { source, destination } = d;
    const draggedOverData = store.getState().dragEventState.draggedOver;

    if (destination && draggedOverData) {
        const draggableData = store.getState().dragEventState.draggableData;
        const sourceDataObj: DroppableData = JSON.parse(source.droppableId);
        const destinationData: DroppableData = JSON.parse(destination.droppableId);
        const { type: destinationType, id: destinationId } = destinationData;
        // const destResult = { id: destinationId, type: destinationType, index: destination.index };
        const sourceData = { index: source.index, id: sourceDataObj.id, type: sourceDataObj.type };

        const gameSnapshot = store.getState().gameSnapshotState.currSnapshot;

        // HANDLE REARRANGE
        if (sourceData.id === destinationData.id && draggedOverData) {
            handleRearrange({ sourceData, draggedOverData, gameSnapshot, draggableData });
            return;
        }


        let updatedSnapshot = gameSnapshot;
        const snapshotUpdater = new SnapshotUpdater(gameSnapshot);

        const draggedHandCard = store.getState().dragEventState.draggedHandCard;
        if (!draggedHandCard) throw Error("No dragged hand card in dragEnd");
        const { actionResultsMap } = gameSnapshot;
        if (!actionResultsMap)
            throw Error("No action results map in gameSnapshot's actionResultsMap");
        const actionResults = actionResultsMap[draggedHandCard.id];
        const actionResult = actionResults.find(
            (res) => res.snapshotUpdateData.targetId === destinationId
        );
        if (!actionResult) throw Error("No action result found for this drop!");

        const data: DragEndData = {
            sourceData,
            destinationData,
            draggedOverData,
            gameSnapshot,
            snapshotUpdater,
            draggedHandCard,
            actionResult,
        };

        if (destinationData.type === "cardGroup") {
            updatedSnapshot = handleEnchant(data);
        } else if (destinationData.type === "place") {
            updatedSnapshot = handleAddDragged(data);
        }

        const { gameData } = store.getState().userGameState;
        if (!gameData) throw Error("No game data in userGameState");
        store.dispatch({ type: "HANDLE_NEW_CLIENT_SNAPSHOT", payload: updatedSnapshot });
        store.dispatch(sendGameMessage(gameData.id, updatedSnapshot));
    }
    store.dispatch(END_DRAG_CLEANUP());
};
