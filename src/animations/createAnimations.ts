import { MutableRefObject } from "react";
import { RefMap, getMiddleOffset, getOffsetOf, getPlayerHandOffset } from "./animationHelperFunctions";
import { dimensionConstants, getCardCSS } from "../helperFunctions/getCardStyles";
import {
  AnimationTrack,
  AnimationTrackStep,
  FromDisappears,
  HandToMiddle,
  HandToTable,
  MiddleToHand,
  MiddleToTable,
  MyAnimationTimeline,
  NothingHappens,
  TableToDiscard,
  TableToMiddle,
  TableToTable,
  ToAppears,
} from "./AnimationTimeline";
import { getMiddleStyles, Offset } from "./getOffset";
import store from "../redux/store";
import { getCard } from "../helperFunctions/locateFunctions";

export interface ActiveAnimation {
  animations: AnimationData[];
  totalDuration: number;
  showPrevSnapshot: number[];
}

export interface HandToTableArgs {
  cardId: number;
  handId: number;
  targetPlaceId: number;
  oldSnapshot: GameSnapshot;
  newSnapshot: GameSnapshot;
  offsetMap: { [key: number]: {dx: number; dy: number} };
}

export const createHandToTableAnimation = (args: HandToTableArgs): ActiveAnimation => {
  const { cardId, handId, targetPlaceId, oldSnapshot, newSnapshot, offsetMap } = args;
  const fromPlaceOffset = store.getState().animationState.offsetMap[handId];
  // const targetPlace = placeRefMap.current[targetPlaceId];
  const targetPlaceOffset = store.getState().animationState.offsetMap[targetPlaceId];
  // assumption: the targetPlace will position its children at its
  // absolute top left, then apply any styles they have.

  const fromHandToMiddleEvents = [
    new HandToMiddle({
      fromOffset: new Offset(fromPlaceOffset),
      fromStyles: getCardCSS(cardId, oldSnapshot),
      toOffset: getMiddleOffset(),
      toStyles: getMiddleStyles(),
      zeroOffset: "fromOffset",
      duration: 500,
    }),
    new FromDisappears({ visibility: "disappearing" }),
    new NothingHappens(),
  ];
  const fromMiddleToTableEvents = [
    new NothingHappens(),
    new ToAppears({}),
    new TableToDiscard({
      duration: 500,
      toOffset: new Offset(targetPlaceOffset),
      toStyles: getCardCSS(cardId, newSnapshot), // NOTE NEW_SNAPSHOT!,
      fromOffset: getMiddleOffset(),
      fromStyles: getMiddleStyles(),
      zeroOffset: "toOffset",
    }),
  ];

  const handToMiddleTrack = new AnimationTrack({ cardId, steps: fromHandToMiddleEvents, homePlaceId: handId }); //, naturalOffset: getOffsetOf(cardId), naturalDimensions: getDimensions(1, "GCZ")
  const middleToTableTrack = new AnimationTrack({ cardId, steps: fromMiddleToTableEvents, homePlaceId: targetPlaceId }); //  naturalOffset: getOffsetOf(cardId),  naturalDimensions: getDimensions(1, "GCZ"),

  const timeline = new MyAnimationTimeline({ animationTracks: [handToMiddleTrack, middleToTableTrack], showPrevSnapshot: [handId] });
  return timeline.getActiveAnimation();
};

export interface DealCardsArgs {
  cardIds: number[];
  deckId: number;
  handId: number;
  oldSnapshot: GameSnapshot;
  newSnapshot: GameSnapshot;
  offsetMap: { [key: number]: {dx: number; dy: number} };
}

export const createDealCardsAnimation = (args: DealCardsArgs): ActiveAnimation => {
  const { cardIds, deckId, handId, oldSnapshot, newSnapshot, offsetMap } = args;
  const imageName = getCard(cardIds[0], oldSnapshot).imageName;
  const isStartGast = imageName.includes("startgast");
  const deckOffset = offsetMap[deckId];
  if (!deckOffset) {
    throw new Error("Offset not found for deck with id of " + deckId);
  }
  const handOffset = offsetMap[handId];
  if (!handOffset) {
    throw new Error("Offset not found for hand with id of " + handId);
  }
  // assumption: the hand will position its children at its
  // absolute top left, then apply any styles they have.

  const animations: AnimationData[] = [];
  let durationOfAllAnimations = 0;
  // cardIds.reverse()

  for (let i = 0; i < cardIds.length; i++) {
    const cardId = cardIds[i];

    const middleStylesWithZIndex = getMiddleStyles();
    const middleZIndex = dimensionConstants.ANIMATED_CARDS_Z_INDEX
    // Set the zIndex to increase with each iteration so that later cards are above earlier cards
    middleStylesWithZIndex["z-index"] = `${middleZIndex + 5 + i}`;
    const handStylesWithZIndex = getCardCSS(cardId, newSnapshot);
    // Set the zIndex to lower than cards leaving deck but all at the same so they naturally
    // fall where they should
    const leftNum = parseInt(handStylesWithZIndex["left"].replace("px", ""))
    handStylesWithZIndex["z-index"] = `${middleZIndex}`;
    // This amount is for card spread amount
    const playerHandOffset = isStartGast ? 0 : getPlayerHandOffset(cardIds.length);
    handStylesWithZIndex["left"] = `${leftNum + dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD * i + playerHandOffset}px` // handCardSpread

    const deckToMiddle = [
      new TableToMiddle({
        duration: 500,
        fromOffset: new Offset(deckOffset),
        fromStyles: getCardCSS(cardId, oldSnapshot),
        toOffset: getMiddleOffset(),
        toStyles: middleStylesWithZIndex,
        zeroOffset: "fromOffset",
      }),
      new FromDisappears({ visibility: "disappearing" }),
      new NothingHappens(),
      new NothingHappens(),
    ];

    const middleToHand = [
      new NothingHappens(),
      new ToAppears({}),
      new MiddleToHand({
        duration: 500,
        toOffset: new Offset(handOffset),
        toStyles: handStylesWithZIndex, // NOTE NEW_SNAPSHOT!,
        fromOffset: getMiddleOffset(),
        fromStyles: middleStylesWithZIndex,
        zeroOffset: "toOffset",
      }),
      // This is for ensuring that handCards don't move back to their incorrect resting place
      // Before the final handCard is dealt -- extend each animation's end duration
      // So they do not end before the final animation is over.
      new AnimationTrackStep({duration: isStartGast ? 0 :  (7 - i) * 520}), 

    ];

    const handToMiddleTrack = new AnimationTrack({ cardId, steps: deckToMiddle, homePlaceId: deckId }); //, naturalOffset: getOffsetOf(cardId), naturalDimensions: getDimensions(1, "GCZ")
    const middleToTableTrack = new AnimationTrack({ cardId, steps: middleToHand, homePlaceId: handId }); //  naturalOffset: getOffsetOf(cardId),  naturalDimensions: getDimensions(1, "GCZ"),

    const delay = i * dimensionConstants.DELAY_BETWEEN_DEALT_CARDS;

    const { animationData, totalDuration } = new MyAnimationTimeline({
      animationTracks: [handToMiddleTrack, middleToTableTrack],
      startDelay: delay,
      showPrevSnapshot: [handId],
    });
    animations.push(...animationData);
    durationOfAllAnimations = totalDuration;
    if(!isStartGast) durationOfAllAnimations -=700 // End before other animations end and return to their incorrect places
  }
  return { animations, totalDuration: durationOfAllAnimations, showPrevSnapshot: [deckId] };
};

export const createDealEnemysCardAnimation = (args: DealCardsArgs): ActiveAnimation => { 
  const { cardIds, deckId, handId, oldSnapshot, newSnapshot, offsetMap } = args;
  const deckOffset = offsetMap[deckId];
  if (!deckOffset) {
    throw new Error("Offset not found for deck with id of " + deckId);
  }
  const handOffset = offsetMap[handId];
  if (!handOffset) {
    throw new Error("Offset not found for hand with id of " + handId);
  }
  const animations: AnimationData[] = [];
  let durationOfAllAnimations = 0;
  // cardIds.reverse()

  for (let i = 0; i < cardIds.length; i++) {
    const cardId = cardIds[i];

    const toStylesWithZindex = getCardCSS(cardId, newSnapshot);
    const middleZIndex = dimensionConstants.ANIMATED_CARDS_Z_INDEX
    // Set the zIndex to increase with each iteration so that later cards are above earlier cards
    toStylesWithZindex["z-index"] = `${middleZIndex + 5 + i}`;
    // const handStylesWithZIndex = getCardCSS(cardId, newSnapshot);
    // Set the zIndex to lower than cards leaving deck but all at the same so they naturally
    // fall where they should
    // handStylesWithZIndex["z-index"] = `${middleZIndex}`;

    const deckToHand = [
      new HandToTable({
        duration: dimensionConstants.DELAY_BETWEEN_DEALT_ENEMY_CARDS,
        fromOffset: new Offset(deckOffset),
        fromStyles: getCardCSS(cardId, oldSnapshot),
        toOffset: new Offset(handOffset),
        toStyles: toStylesWithZindex,
        zeroOffset: "toOffset",
      }),
    ];

    const handToMiddleTrack = new AnimationTrack({ cardId, steps: deckToHand, homePlaceId: handId }); //, naturalOffset: getOffsetOf(cardId), naturalDimensions: getDimensions(1, "GCZ")

    const delay = i * dimensionConstants.DELAY_BETWEEN_DEALT_ENEMY_CARDS;

    const { animationData, totalDuration } = new MyAnimationTimeline({
      animationTracks: [handToMiddleTrack],
      startDelay: delay,
      showPrevSnapshot: [handId],
    });
    animations.push(...animationData);
    durationOfAllAnimations = totalDuration;
  }
  return { animations, totalDuration: durationOfAllAnimations, showPrevSnapshot: [deckId] };
}

export interface DestroyArgs {
  handCardId: number;
  handId: number;
  discardPileId: number;
  GCZId: number;
  GCZCardId: number;
  oldSnapshot: GameSnapshot;
  newSnapshot: GameSnapshot;
  placeRefMap: MutableRefObject<RefMap>;
}

export const createDestroyAnimation = (args: DestroyArgs): ActiveAnimation => {
  const { handCardId, handId, discardPileId, GCZCardId, GCZId, oldSnapshot, newSnapshot, placeRefMap } = args;
  const hand = placeRefMap.current[handId];
  const discardPile = placeRefMap.current[discardPileId];
  const GCZ = placeRefMap.current[GCZId];

  // The destroying card
  const fromHandToMiddleEvents = [
    new HandToMiddle({
      fromOffset: getOffsetOf(hand),
      fromStyles: getCardCSS(handCardId, oldSnapshot),
      toOffset: getMiddleOffset(),
      toStyles: getMiddleStyles(),
      zeroOffset: "fromOffset",
      duration: 500,
    }),
    new FromDisappears({}),
    new NothingHappens(),
    new NothingHappens(),
    new NothingHappens(),
    new NothingHappens(),
  ];
  const fromMiddleToTargetCardEvents = [
    new NothingHappens(),
    new ToAppears({}),
    new MiddleToTable({
      duration: 800,
      toOffset: getOffsetOf(GCZ),
      toStyles: getCardCSS(GCZCardId, oldSnapshot), // NOTE OLD_SNAPSHOT!,
      fromOffset: getMiddleOffset(),
      fromStyles: getMiddleStyles(),
      isProxy: true,
    }),
    new FromDisappears({}),
    new NothingHappens(),
    new NothingHappens(),
  ];
  const fromTargetCardToDiscardEvents = [
    new NothingHappens(),
    new NothingHappens(),
    new NothingHappens(),
    new ToAppears({}),
    new TableToDiscard({
      duration: 500,
      toOffset: getOffsetOf(discardPile),
      toStyles: getCardCSS(handCardId, newSnapshot), // NOTE OLD_SNAPSHOT!,
      fromOffset: getOffsetOf(GCZ),
      fromStyles: getCardCSS(handCardId, newSnapshot),
      zeroOffset: "toOffset",
    }),
    new NothingHappens(),
  ];
  const handToMiddleTrack = new AnimationTrack({ cardId: handCardId, homePlaceId: handId, steps: fromHandToMiddleEvents });
  const middleToTargetCardTrack = new AnimationTrack({ cardId: handCardId, homePlaceId: undefined, steps: fromMiddleToTargetCardEvents });
  const targetCardToDiscardTrack = new AnimationTrack({ cardId: handCardId, homePlaceId: discardPileId, steps: fromTargetCardToDiscardEvents });

  // The card being destroyed
  const fromGCZToDiscard = [
    new NothingHappens(),
    new NothingHappens(),
    new NothingHappens(),
    new NothingHappens(),
    new NothingHappens(),
    new TableToDiscard({
      fromOffset: getOffsetOf(GCZ),
      fromStyles: getCardCSS(handCardId, newSnapshot),
      toOffset: getOffsetOf(discardPile),
      toStyles: getCardCSS(handCardId, newSnapshot),
      zeroOffset: "toOffset",
      duration: 500,
    }),
  ];

  const gczToDiscardTrack = new AnimationTrack({ cardId: GCZCardId, homePlaceId: discardPileId, steps: fromGCZToDiscard });

  const timeline = new MyAnimationTimeline({
    showPrevSnapshot: [handId, GCZId],
    animationTracks: [gczToDiscardTrack, handToMiddleTrack, middleToTargetCardTrack, targetCardToDiscardTrack],
  });
  timeline.addHideTrack(GCZCardId, GCZId);
  return timeline.getActiveAnimation();
};

export const createRearrangeAnimation = (args: {
  cardIds: number[];
  placeId: number;
  oldSnapshot: GameSnapshot;
  newSnapshot: GameSnapshot;
  offsetMap: { [key: number]: {dx: number; dy: number} };
}): ActiveAnimation => {    
  const { cardIds, placeId, oldSnapshot, newSnapshot, offsetMap } = args;
  const place = offsetMap[placeId];
  if (!place) {
    throw new Error("Offset not found for place with id of " +
      placeId);
  }

 const leftToRightSteps = [
    new TableToTable({
      duration: 800,
      fromOffset: new Offset(place),
      fromStyles: getCardCSS(cardIds[0], oldSnapshot),
      toOffset: new Offset(place),
      toStyles: getCardCSS(cardIds[0], newSnapshot),
      zeroOffset: "fromOffset",
    }),
  ];

  const rightToLeftSteps = [
    new TableToTable({
      duration: 800,
      fromOffset: new Offset(place),
      fromStyles: getCardCSS(cardIds[1], oldSnapshot),
      toOffset: new Offset(place),
      toStyles: getCardCSS(cardIds[1], newSnapshot),
      zeroOffset: "fromOffset",
    }),
  ];

  const leftToRightTrack = new AnimationTrack({ cardId: cardIds[0], homePlaceId: placeId, steps: leftToRightSteps });
  const rightToLeftTrack = new AnimationTrack({ cardId: cardIds[1], homePlaceId: placeId, steps: rightToLeftSteps });

  const timeline = new MyAnimationTimeline({
    showPrevSnapshot: [placeId],
    animationTracks: [leftToRightTrack, rightToLeftTrack],
  });
  return timeline.getActiveAnimation();
}
