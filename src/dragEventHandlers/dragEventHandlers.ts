import { BeforeCapture, DraggableLocation, DragUpdate, DropResult } from "react-beautiful-dnd";
import { locateCard, locatePlace } from "../helperFunctions/locateFunctions";
import store, { AppDispatch } from "../redux/store";
import { addDraggedThunk } from "../redux/thunks";
import {
    END_DRAG_CLEANUP,
    SET_DRAGGABLE_DATA,
    SET_DRAGGED_HAND_CARD,
    SET_HIGHLIGHTS,
    START_REARRANGING,
    UPDATE_DRAGGED_OVER,
} from "../redux/dragEventSlice";
import { Middleware } from "@reduxjs/toolkit";
import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { sendGameMessage } from "../websocket/websocketActionCreators";

// export const dragEventMiddleware: Middleware = ({ dispatch }) => {
//   return (next: AppDispatch) => (action: DragEvent) => {
//     switch (action.type) {
//       case "dragStart": {
//         const { source, draggableId } = action.payload;
//         const DroppableData: DroppableData = JSON.parse(draggableId);
//         const droppableData: DroppableData = JSON.parse(source.droppableId);
//         const gameSnapshot = store.getState().gameSnapshotState.currSnapshot;
//         if (isHandCard(droppableData.id, gameSnapshot)) {
//           dispatch(SET_HIGHLIGHTS(gameSnapshot));
//         } else {
//           dispatch(
//             START_REARRANGING({
//               placeId: droppableData.id,
//               sourceIndex: source.index,
//               draggedId: DroppableData.id,
//             })
//           );
//         }
//         break;
//       }
//       case "dragEnd":
//         {
//           const d = action.payload;
//           const { source, destination } = action.payload;

//           if (destination) {
//             const sourceData: DroppableData = JSON.parse(source.droppableId);
//             const destinationData: DroppableData = JSON.parse(destination.droppableId);
//             const { type: sourceType, id: sourceId } = sourceData;
//             const { type: destinationType, id: destinationId } = destinationData;
//             const sourceResult = { id: sourceId, type: sourceType, index: source.index };
//             const destResult = { id: destinationId, type: destinationType, index: destination.index };
//             console.log(sourceResult, destResult);
//             if (isRearrange(d)) dispatch(REARRANGE({ source: sourceResult, destination: destResult }));
//             // else if (isEnchant(d, gameSnapshot)) dispatch(enchantThunk({ source: d.source, destination: d.destination }));
//             // else if (isDestroy(d, gameSnapshot)) dispatch(destroyCardThunk({ source: d.source, destination: d.destination }));
//             // TODO: figure out how handle this without store.dispatch
//             else if (isAddDrag(d)) store.dispatch(addDraggedThunk(sourceResult, destResult));
//           }
//           dispatch(END_DRAG_CLEANUP());
//         }
//         break;
//       default:
//         return next(action);
//     }
//   };
// };

// type DragEvent = DragStart | DragEnd;

// type DragEnd = { type: "dragEnd"; payload: DropResult };

// type DragStart = { type: "dragStart"; payload: { source: DraggableLocation; draggableId: string } };

export const dragEnd = (d: DropResult) => ({ type: "dragEnd", payload: d });

const isHandCard = (sourceId: number, gameSnapshot: GameSnapshot) =>
    locatePlace(sourceId, gameSnapshot).placeType === "hand";

const cardHasChangedIndex = (d: DropResult) =>
    d.destination && d.destination.index !== d.source.index;

const cardMovedWithinOnePlace = (d: DropResult) =>
    d.destination && d.destination.droppableId === d.source.droppableId;

const isRearrange = (d: DropResult) => cardHasChangedIndex(d) && cardMovedWithinOnePlace(d);

const isEnchant = (d: DropResult, gameSnapshot: GameSnapshot) => {
    const handCard = getDraggedHandCard(gameSnapshot, parseInt(d.draggableId));
    return (
        handCard?.action.actionType === "enchant" ||
        handCard?.action.actionType === "enchantWithBff"
    );
};

const isDestroy = (d: DropResult, gameSnapshot: GameSnapshot) => {
    const handCard = getDraggedHandCard(gameSnapshot, parseInt(d.draggableId));
    return handCard?.action.actionType === "destroy";
};

const getDraggedHandCard = (gameSnapshot: GameSnapshot, draggableId: number | undefined) =>
    draggableId
        ? gameSnapshot.players[0].places.hand.cards.find((e) => e.id === draggableId)
        : undefined;

const cardDidLeaveHand = (d: DropResult) =>
    d.destination && d.destination.droppableId !== d.source.droppableId;

const cardDroppedElswhere = (d: DropResult) => d.destination;

const isAddDrag = (d: DropResult) => cardDidLeaveHand(d) && cardDroppedElswhere(d);

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
    if (isHandCard(droppableData.id, store.getState().gameSnapshotState.currSnapshot)) {
        store.dispatch(SET_HIGHLIGHTS(store.getState().gameSnapshotState.currSnapshot));
    }
    // { type: "SET_HIGHLIGHTS", payload: draggableId })
    else {
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
        const { id, type, calculatedIndex, enchantableNeighbours, placeType, player } =
            droppableData;
        const index = calculatedIndex ?? dragUpdate.destination.index;
        draggedOverData = { type, id, index, enchantableNeighbours, placeType, player };
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

    if (destination) {
        const draggableData = store.getState().dragEventState.draggableData;
        const sourceData: DroppableData = JSON.parse(source.droppableId);
        const destinationData: DroppableData = JSON.parse(destination.droppableId);
        const { type: sourceType, id: sourceId } = sourceData;
        const { type: destinationType, id: destinationId } = destinationData;
        const sourceResult = { id: sourceId, type: sourceType, index: source.index };
        const destResult = { id: destinationId, type: destinationType, index: destination.index };
        // if (isRearrange(d)) store.dispatch(REARRANGE({ source: sourceResult, destination: destResult }));
        // else if (isEnchant(d, gameSnapshot)) store.dispatch(enchantThunk({ source: d.source, destination: d.destination }));
        // else if (isDestroy(d, gameSnapshot)) store.dispatch(destroyCardThunk({ source: d.source, destination: d.destination }));
        // else
        const gameSnapshot = store.getState().gameSnapshotState.currSnapshot;
        const draggedHandCard = store.getState().dragEventState.draggedHandCard;
        const numDraggedElements = draggableData?.type === "cardGroup" ? draggableData.numCards : 1;
        if (!draggedHandCard) return; // What about rearrange?
        const { actionResultsMap } = gameSnapshot;
        const actionResults = actionResultsMap[draggedHandCard.id];
        const actionResult = actionResults.find(
            (res) => res.snapshotUpdateData.targetId === destinationId
        );

        if (!actionResult) throw Error("No action result found for this drop!");
        const snapshotUpdater = new SnapshotUpdater(gameSnapshot, actionResult.snapshotUpdateData);

        if (destResult.type === "cardGroup") {
            const { calculatedIndex, id, placeType, player } = destinationData;

            if (!placeType || calculatedIndex === undefined || player === undefined) {
                throw Error("No place type or calculated Index in CarGroup Droppable Data! ");
            }
            const placeId = player
                ? gameSnapshot.nonPlayerPlaces[placeType].id
                : gameSnapshot.players[player].places[placeType].id;
            snapshotUpdater.addChange({
                destination: { placeId, index: calculatedIndex },
                source: {
                    placeId: sourceData.id,
                    index: source.index,
                    numDraggedElements: 1,
                },
            });
            const snapshotUpdateData: SnapshotUpdateData = {
                type: "enchant",
                targetId: destinationId,
                playedCardIds: [draggedHandCard.id],
            };
            snapshotUpdater.setSnapshotUpdateData(snapshotUpdateData);
        }
        if (destResult.type === "place") {
            snapshotUpdater.addChange({
                destination: { placeId: destinationId, index: destination.index },
                source: {
                    placeId: sourceData.id,
                    index: sourceData.calculatedIndex ?? source.index,
                    numDraggedElements: 1,
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
        console.log("updatedSnapshotData", updatedSnapshot.snapshotUpdateData);
        const { gameData } = store.getState().userGameState;
        if (!gameData) throw Error("No game data in userGameState");
        store.dispatch({ type: "HANDLE_NEW_CLIENT_SNAPSHOT", payload: updatedSnapshot });
        store.dispatch(sendGameMessage(gameData.id, updatedSnapshot));
        // if (isAddDrag(d)) store.dispatch(addDraggedThunk(sourceResult, destResult));
    }
    store.dispatch(END_DRAG_CLEANUP());
};
