import { CSSProperties } from "styled-components";
import { CardCSSMap } from "../animations/animationHelperFunctions";
import { getCard, getNumCards, locateCard } from "./locateFunctions";

export const getCardStyleValuesFromPlaceAndPlayer = (placeType: PlaceType, player: number, gameSnapshot: GameSnapshot) => {
  const card: GameCard = {
    pointValue: 1,
    action: { actionType: "addDragged", highlightType: "card", targetPlayerType: "enemy" },
    name: "temp",
    id: 99999999999,
    imageName: "test",
    cardType: "guest",
    index: 0,
  };
  gameSnapshot.players[player].places[placeType].cards.push(card);
  return getCardStyleValues(card.id, gameSnapshot);
};

export const getCardStyleValues = (cardId: number, gameSnapshot: GameSnapshot) => {
  const { index, placeType, player } = locateCard(cardId, gameSnapshot);

  const place = placeType;

  const numCards = getNumCards(player, placeType, gameSnapshot);

  const tableCardHeights = { enemy: 120, self: 148 };
  const handCardHeights = { enemy: 100, self: 180 };

  const playerType = player === 0 || player === null ? "self" : "enemy";

  const heightToWidthRatio = 1500 / 973;
  const tableCardHeight = tableCardHeights[playerType];
  const tableCardWidth = tableCardHeight / heightToWidthRatio;

  const handCardHeight = handCardHeights[playerType];
  const handCardWidth = handCardHeight / heightToWidthRatio;

  const cardLeftSpread = numCards < 6 ? tableCardWidth : tableCardWidth - numCards * 3;
  const handCardLeftSpread = 35;
  const cardTopSpread = place !== "specialsZone" ? (place === "unwantedsZone" ? -40 : 0) : -30;
  const handCardRotation = 10 * index - (numCards / 2 - 0.5) * 10;
  const handCardShadow = "10px 10px 10px black";
  const tableCardShadow = "2px 2px 2px black";
  const tableCardRotate = 0;
  const tableCardRotateY = place !== "deck" ? 0 : 180;

  const handRotateY = playerType === "enemy" ? 180 : 0; // "0.5turn" : "0";

  const dimensions: CardDimensions = {
    cardHeight: tableCardHeight,
    cardWidth: tableCardWidth,
    zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
    left: placeType !== "deck" && placeType !== "discardPile" ? cardLeftSpread * index : 0,
    top: cardTopSpread * index,
    rotate: tableCardRotate,
    rotateY: tableCardRotateY,
    boxShadow: tableCardShadow,
    scale: 1,
  };

  const handDimensions: CardDimensions = {
    cardHeight: handCardHeight,
    cardWidth: handCardWidth,
    left: handCardLeftSpread * index,
    top: 0,
    zIndex: 5,
    rotate: handCardRotation,
    rotateY: handRotateY,
    boxShadow: handCardShadow,
    scale: 1,
  };
  if (placeType === "hand") return handDimensions;
  return dimensions;
};

export const dimensionConstants = {
  FEATURED_CARD_SCALE: 2,
  MAX_HAND_CARD_LEFT_SPREAD: 125,
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
  HAND_TO_TABLE_SCALE_FACTOR: 1.5,
};

export const getCardStyles = (cardId: number, gameSnapshot: GameSnapshot): CSSProperties => {
  const { cardHeight, cardWidth, scale, rotateY, zIndex, left, top, rotate, boxShadow } = getCardStyleValues(cardId, gameSnapshot);

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
  const isEnemyHand = placeType === "hand" && player !== 0;
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

export const getFrontAndBackStyles = (cardId: number, gameSnapshot: GameSnapshot): CSSProperties => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden",
  borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
  boxShadow: locateCard(cardId, gameSnapshot).placeType === "hand" ? dimensionConstants.HAND_CARD_SHADOW : dimensionConstants.TABLE_CARD_SHADOW,
});

export const getOuterWrapperStyles = (): CSSProperties => ({
  transformOrigin: "50% 50%" /*seems to do nothing?*/,
  transformStyle: "preserve-3d",
  position: "absolute",
  pointerEvents: "none",
  zIndex: 9,
});

export const getCardCSS = (cardId: number, gameSnapshot: GameSnapshot): CardCSSMap => {
  const { cardHeight, cardWidth, scale, rotateY, zIndex, left, top, rotate, boxShadow } = getCardStyleValues(cardId, gameSnapshot);
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
    "border-radius": `${dimensionConstants.CARD_BORDER_RADIUS}px`,
  };
  return styles;
};
