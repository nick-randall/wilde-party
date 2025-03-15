import { CSSProperties } from "styled-components";
import { CardCSSMap, getCardName } from "../animations/animationHelperFunctions";
import { getNumCards, locateCard } from "./locateFunctions";
import store from "../redux/store";
import { getCardGroupsObjs, getCumulativeWidths } from "./groupGCZCards";

export const getCardStyleValues = (cardId: number, gameSnapshot: GameSnapshot) => {
    const { index, placeType, player } = locateCard(cardId, gameSnapshot);
    return getCardStyleValuesFromPlaceAndPlayer(placeType, player, gameSnapshot, index);
};
export const getCardStyleValuesFromPlaceAndPlayer = (
    placeType: PlaceType,
    player: number | null,
    gameSnapshot: GameSnapshot,
    index: number = -1
) => {
    const myIndex = store.getState().userGameState.myIndex;
    const place = placeType;

    const numCards = index > -1 ? getNumCards(player, placeType, gameSnapshot) : 0;
    const playerType = player === myIndex || player === null ? "self" : "enemy";

    const tableCardHeight = dimensionConstants.TABLE_CARD_HEIGHTS[playerType];
    const tableCardWidth = tableCardHeight / dimensionConstants.HEIGHT_TO_WIDTH_RATIO;

    const handCardHeight = dimensionConstants.HAND_CARD_HEIGHTS[playerType];
    const handCardWidth = handCardHeight / dimensionConstants.HEIGHT_TO_WIDTH_RATIO;

    let cardLeftSpread = numCards < 6 ? tableCardWidth : tableCardWidth - numCards * 3;
    // TODO why would index ever be -1?
    let left =
        placeType !== "deck" && placeType !== "discardPile" && index > -1
            ? cardLeftSpread * index
            : 0;
    const cardTopSpread = place !== "specialsZone" ? (place === "unwantedsZone" ? -40 : 0) : -30;
    let top = cardTopSpread * index;
    // This part is for the guestCardZone, to ensure for example, that a card coming after a zwilling card group is not 
    // placed two cards to the right, but only one, since a zwilling card group is made of two cards but only one card wide.
    if (place === "guestCardZone" && player !== null && index > -1) {
        const card = gameSnapshot.players[player].places[placeType].cards[index];
        const GCZCards = gameSnapshot.players[player].places[placeType].cards;
        const cardGroupObjs = getCardGroupsObjs(GCZCards);
        const cardGroupIndex = cardGroupObjs.findIndex((cardGroup) => cardGroup.cards.map(c => c.id).includes(card.id));
        const widthMap = getCumulativeWidths(cardGroupObjs);
        left = widthMap[cardGroupIndex] * tableCardWidth;

        if(getCardName(card) === "zwilling") {
            top = tableCardHeight / 2;
        }
    }

    const handCardLeftSpread = dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD;

    const handCardRotation = 10 * index - (numCards / 2 - 0.5) * 10;

    const tableCardRotate = 0;
    const tableCardRotateY = place !== "deck" ? 0 : 180;

    const handRotateY = playerType === "enemy" ? 180 : 0; // "0.5turn" : "0";

    const dimensions: CardDimensions = {
        cardHeight: tableCardHeight,
        cardWidth: tableCardWidth,
        zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
        left,
        top,
        rotate: tableCardRotate,
        rotateY: tableCardRotateY,
        boxShadow: dimensionConstants.TABLE_CARD_SHADOW,
        scale: 1,
    };

    const handDimensions: CardDimensions = {
        cardHeight: handCardHeight,
        cardWidth: handCardWidth,
        left: handCardLeftSpread * index,
        top: 0,
        zIndex: 8,
        rotate: handCardRotation,
        rotateY: handRotateY,
        boxShadow: dimensionConstants.HAND_CARD_SHADOW,
        scale: 1,
    };
    if (placeType === "hand") return handDimensions;
    return dimensions;
};

export const getCardGroupStyles = (
    cardGroup: CardGroupObj,
    physicalIndex: number,
    gameSnapshot: GameSnapshot
): CardDimensions => {
    const { player, placeType } = locateCard(cardGroup.id, gameSnapshot);
    // if(player === null)

    //   throw new Error("Player is null");
    const myIndex = store.getState().userGameState.myIndex;

    const playerType = player === myIndex || player === null ? "self" : "enemy";

    const cardHeight = dimensionConstants.TABLE_CARD_HEIGHTS[playerType];
    const cardWidth = cardHeight / dimensionConstants.HEIGHT_TO_WIDTH_RATIO;

    // Currently assuming place is GCZ
    return {
        cardHeight,
        cardWidth,
        zIndex: dimensionConstants.TABLE_CARD_Z_INDEX,
        left: cardWidth * physicalIndex,
        top: 0,
        rotate: 0,
        rotateY: 0,
        boxShadow: dimensionConstants.TABLE_CARD_SHADOW,
        scale: 1,
    };
};

export const dimensionConstants = {
    TABLE_CARD_HEIGHTS: { enemy: 120, self: 148 },
    HAND_CARD_HEIGHTS: { enemy: 100, self: 180 },
    HEIGHT_TO_WIDTH_RATIO: 1500 / 973,
    FEATURED_CARD_SCALE: 2,
    MIN_HAND_CARD_LEFT_SPREAD: 17,
    MAX_HAND_CARD_LEFT_SPREAD: 60,
    DRAGGED_CARD_SCALE: 1.1,
    DRAGGED_CARD_WIDTH: 112,
    TABLE_CARD_Z_INDEX: 3,
    DRAGGED_CARD_Z_INDEX: 6,
    CARD_BORDER_RADIUS: 6,
    ANIMATED_CARDS_Z_INDEX: 15,
    MIDDLE_CARD_SHADOW: "20px 20px 20px black",
    HAND_CARD_SHADOW: "10px 10px 10px black",
    TABLE_CARD_SHADOW: "2px 2px 2px black",
    DELAY_BETWEEN_DEALT_CARDS: 600,
    DELAY_BETWEEN_DEALT_ENEMY_CARDS: 200,
    HAND_TO_TABLE_SCALE_FACTOR: 1.5,
};

export const getCardStyles = (cardId: number, gameSnapshot: GameSnapshot): CSSProperties => {
    const { cardHeight, cardWidth, scale, rotateY, zIndex, left, top, rotate, boxShadow } =
        getCardStyleValues(cardId, gameSnapshot);

    const styles: CSSProperties = {
        zIndex: zIndex,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        left: `${left}px`,
        top: `${top}px`,
        position: "absolute",
        transform: `rotate(${rotate}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: "300ms",
        scale: `${scale}`,
        // box-shadow is in innerWrapperStyles
        boxShadow: boxShadow,
        userSelect: "none",
        transformStyle: "preserve-3d",
        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
    };
    return styles;
};

export const getCardIsFaceup = (cardId: number, gameSnapshot: GameSnapshot) => {
    const { placeType, player } = locateCard(cardId, gameSnapshot);
    const myIndex = store.getState().userGameState.myIndex;
    const isEnemyHand = placeType === "hand" && player !== myIndex;
    const isDeck = placeType === "deck";
    return !isEnemyHand && !isDeck;
};

export const getInnerWrapperStyle = (cardId: number, gameSnapshot: GameSnapshot) => {
    const styles = getCardStyles(cardId, gameSnapshot);
    // We need to remove box-shadow for rendering card innerWrapper element
    // otherwise a shadow will be shown when animating hidden objects
    delete styles.boxShadow;
    return styles;
};

export const getFrontAndBackStyles = (
    cardId: number,
    gameSnapshot: GameSnapshot
): CSSProperties => ({
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
    boxShadow:
        locateCard(cardId, gameSnapshot).placeType === "hand"
            ? dimensionConstants.HAND_CARD_SHADOW
            : dimensionConstants.TABLE_CARD_SHADOW,
});

export const getOuterWrapperStyles = (): CSSProperties => ({
    transformOrigin: "50% 50%" /*seems to do nothing?*/,
    transformStyle: "preserve-3d",
    position: "absolute",
    pointerEvents: "none",
    zIndex: 9,
});

export const getCardCSS = (cardId: number, gameSnapshot: GameSnapshot): CardCSSMap => {
    const { cardHeight, cardWidth, scale, rotateY, zIndex, left, top, rotate, boxShadow } =
        getCardStyleValues(cardId, gameSnapshot);
    const styles: CardCSSMap = {
        "z-index": `${zIndex}`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        left: `${left}px`,
        top: `${top}px`,
        position: "absolute",
        transform: `rotate(${rotate}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: "300ms",
        scale: `${scale}`,
        "box-shadow": boxShadow,
        "user-select": "none",
        "transform-style": "preserve-3d",
        "-webkit-transform-style": "preserve-3d",
        "-moz-transform-style": "preserve-3d",
        "border-radius": `${dimensionConstants.CARD_BORDER_RADIUS}px`,
    };
    return styles;
};
