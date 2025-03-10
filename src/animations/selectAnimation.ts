import { off } from "process";
import { locateCard, locatePlace } from "../helperFunctions/locateFunctions";
import store from "../redux/store";
import { HandToTable } from "./AnimationTimeline";
import {
    ActiveAnimation,
    createDealCardsAnimation,
    createDealEnemysCardAnimation,
    createEnchantAnimation,
    createHandToTableAnimation,
    createRearrangeAnimation,
    DealCardsArgs,
    HandToTableArgs,
} from "./createAnimations";

export const selectAnimation = (
    oldSnapshot: GameSnapshot,
    newSnapshot: GameSnapshot
): ActiveAnimation | undefined => {
    const { offsetMap } = store.getState().animationState;
    const { snapshotUpdateData } = newSnapshot;
    if (!snapshotUpdateData) throw Error("No snapshot update data!");
    const { type, targetId, playedCardIds, secondaryCardId } = snapshotUpdateData;

    switch (type) {
        case "dealingCards":
            return dealCardAnimation(oldSnapshot, newSnapshot);

        case "dealingInitialCards": {
            const { player } = locatePlace(targetId, newSnapshot);
            const { myIndex } = store.getState().userGameState;
            if (player === myIndex) {
                return dealCardAnimation(oldSnapshot, newSnapshot);
            } else {
                return dealEnemyCardAnimation(oldSnapshot, newSnapshot);
            }
        }
        case "dealingStartingGuest":
            return dealCardAnimation(oldSnapshot, newSnapshot);
        case "addDragged":
            return createAddDraggedAnimation(oldSnapshot, newSnapshot);
        case "enchant":
            return createEnchantCardAnimation(oldSnapshot, newSnapshot);
        case "rearrangingTablePlace":
            return createRearrangeTablePlaceAnimation(oldSnapshot, newSnapshot);
    }
};
const dealCardAnimation = (oldSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
    const { snapshotUpdateData } = newSnapshot;
    const { offsetMap } = store.getState().animationState;

    if (!snapshotUpdateData) throw Error("No snapshot update data!");
    const dealCardsArgs: DealCardsArgs = {
        cardIds: snapshotUpdateData.playedCardIds,
        deckId: newSnapshot.nonPlayerPlaces.deck.id,
        handId: snapshotUpdateData.targetId,
        oldSnapshot: oldSnapshot,
        newSnapshot: newSnapshot,
        offsetMap: offsetMap,
    };
    return createDealCardsAnimation(dealCardsArgs);
};

const dealEnemyCardAnimation = (oldSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
    const { snapshotUpdateData } = newSnapshot;
    const { offsetMap } = store.getState().animationState;

    if (!snapshotUpdateData) throw Error("No snapshot update data!");
    const dealCardsArgs: DealCardsArgs = {
        cardIds: snapshotUpdateData.playedCardIds,
        deckId: newSnapshot.nonPlayerPlaces.deck.id,
        handId: snapshotUpdateData.targetId,
        oldSnapshot: oldSnapshot,
        newSnapshot: newSnapshot,
        offsetMap: offsetMap,
    };
    return createDealEnemysCardAnimation(dealCardsArgs);
};

const createAddDraggedAnimation = (oldSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
    const { snapshotUpdateData } = newSnapshot;
    const { offsetMap } = store.getState().animationState;
    if (!snapshotUpdateData) throw Error("No snapshot update data!");
    const { player } = locateCard(snapshotUpdateData.playedCardIds[0], oldSnapshot);
    if (player === null) throw Error("Hand cannot be NULL");
    const handId = oldSnapshot.players[player].places.hand.id;
    const handToTableArgs: HandToTableArgs = {
        cardId: snapshotUpdateData.playedCardIds[0],
        handId: handId,
        targetPlaceId: snapshotUpdateData.targetId,
        oldSnapshot: oldSnapshot,
        newSnapshot: newSnapshot,
        offsetMap: offsetMap,
    };
    return createHandToTableAnimation(handToTableArgs);
};

const createEnchantCardAnimation = (oldSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
    const { snapshotUpdateData } = newSnapshot;
    const { offsetMap } = store.getState().animationState;
    if (!snapshotUpdateData) throw Error("No snapshot update data!");
    const { player } = locateCard(snapshotUpdateData.playedCardIds[0], oldSnapshot);
    if (player === null) throw Error("Hand cannot be NULL");
    const handId = oldSnapshot.players[player].places.hand.id;
    const { player: ownerOfTargetCard, placeType } = locateCard(snapshotUpdateData.targetId, newSnapshot);
    if (ownerOfTargetCard === null) throw Error("Hand cannot be NULL");
    const targetPlace = newSnapshot.players[ownerOfTargetCard].places[placeType];
    const args = {
        cardId: snapshotUpdateData.playedCardIds[0],
        handId: handId,
        targetCardId: snapshotUpdateData.targetId,
        targetPlaceId: targetPlace.id,
        oldSnapshot: oldSnapshot,
        newSnapshot: newSnapshot,
        offsetMap: offsetMap,
    };
    return createEnchantAnimation(args);
};

const createRearrangeTablePlaceAnimation = (
    oldSnapshot: GameSnapshot,
    newSnapshot: GameSnapshot
): ActiveAnimation | undefined => {
    const { snapshotUpdateData } = newSnapshot;
    const { offsetMap } = store.getState().animationState;
    if (!snapshotUpdateData) throw Error("No snapshot update data!");

    const args = {
        cardIds: snapshotUpdateData.playedCardIds,
        placeId: snapshotUpdateData.targetId,
        oldSnapshot: oldSnapshot,
        newSnapshot: newSnapshot,
        offsetMap: offsetMap,
    };
    return createRearrangeAnimation(args);
};
