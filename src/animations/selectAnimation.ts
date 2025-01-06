import { locatePlace } from "../helperFunctions/locateFunctions";
import store from "../redux/store";
import {
    ActiveAnimation,
    createDealCardsAnimation,
    createDealEnemysCardAnimation,
    DealCardsArgs,
} from "./createAnimations";

export const selectAnimation = (
    oldSnapshot: GameSnapshot,
    newSnapshot: GameSnapshot
): ActiveAnimation | undefined => {
    const { offsetMap } = store.getState().offsetMapState;
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
    }
};
const dealCardAnimation = (oldSnapshot: GameSnapshot, newSnapshot: GameSnapshot) => {
    const { snapshotUpdateData } = newSnapshot;
    const { offsetMap } = store.getState().offsetMapState;

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
    const { offsetMap } = store.getState().offsetMapState;

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
