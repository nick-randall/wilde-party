import SnapshotUpdater from "../helperFunctions/gameSnapshotUpdates/SnapshotUpdater";
import { getCardGroupsObjs, getCardRowShapeOnRearrange } from "../helperFunctions/groupGCZCards";
import { locatePlace } from "../helperFunctions/locateFunctions";
import { END_DRAG_CLEANUP } from "../redux/dragEventSlice";
import store from "../redux/store";
import { sendGameMessage } from "../websocket/websocketActionCreators";

interface SourceData {
    id: number;
    index: number;
    type: DroppableEntityType;
}

interface EnchantData {
    sourceData: SourceData;
    destinationData: DroppableData;
    draggedOverData: DroppableData;
    draggedHandCard: GameCard;
    gameSnapshot: GameSnapshot;
    actionResult: CardActionResult;
    snapshotUpdater: SnapshotUpdater;
}

interface AddDraggedData {
    sourceData: SourceData;
    destinationData: DroppableData;
    draggedOverData: DroppableData;
    draggedHandCard: GameCard;
    snapshotUpdater: SnapshotUpdater;
}

export const addDragged = ({
    destinationData,
    draggedOverData,
    sourceData,
    draggedHandCard,
    snapshotUpdater,
}: AddDraggedData) => {
    if (draggedOverData.index === undefined) throw Error("No index in draggedOverData");
    snapshotUpdater.addChange({
        destination: {
            placeId: destinationData.id,
            index: draggedOverData.calculatedIndex ?? 0,
        },
        source: {
            placeId: sourceData.id,
            index: sourceData.index,
        },
    });
    const snapshotUpdateData: SnapshotUpdateData = {
        type: "addDragged",
        targetId: destinationData.id,
        playedCardIds: [draggedHandCard.id],
    };
    snapshotUpdater.setSnapshotUpdateData(snapshotUpdateData);
};

export const handleEnchant = ({
    destinationData,
    draggedOverData,
    sourceData,
    draggedHandCard,
    gameSnapshot,
    actionResult,
    snapshotUpdater,
}: EnchantData) => {
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
            index: sourceData.index,
        },
    });
    const snapshotUpdateData: SnapshotUpdateData = {
        type: draggedHandCard.cardType === "bff" ? "enchantWithBff" : "enchant",
        targetId: destinationData.id,
        playedCardIds: [draggedHandCard.id],
    };
    snapshotUpdater.setSnapshotUpdateData(snapshotUpdateData);
};

interface RearrangeData {
    sourceData: DroppableData;
    draggedOverData: DroppableData;
    gameSnapshot: GameSnapshot;
    draggableData?: DraggableData;
}

export const handleRearrange = ({
    sourceData,
    draggedOverData,
    gameSnapshot,
    draggableData,
}: RearrangeData) => {
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
};
