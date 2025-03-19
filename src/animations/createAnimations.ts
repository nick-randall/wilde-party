import { MutableRefObject } from "react";
import {
    RefMap,
    getMiddleOffset,
    getOffsetOf,
    getPlayerHandOffset,
} from "./animationHelperFunctions";
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
import { getCard, locateCard } from "../helperFunctions/locateFunctions";
import { getCardGroupsObjs } from "../helperFunctions/groupGCZCards";

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
    offsetMap: { [key: number]: { dx: number; dy: number } };
}

export const createHandToTableAnimation = (args: HandToTableArgs): ActiveAnimation => {
    const { cardId, handId, targetPlaceId, oldSnapshot, newSnapshot, offsetMap } = args;
    const fromPlaceOffset = offsetMap[handId];
    const targetPlaceOffset = offsetMap[targetPlaceId];
    const { placeType: newPlaceType, player } = locateCard(cardId, newSnapshot);
    if (player === null) throw new Error("Player cannot be null");

    const moveCardsRightTracks = [];

    if (newPlaceType === "guestCardZone") {
        const cardRow = newSnapshot.players[player].places[newPlaceType].cards;
        const cardGroupObjs = getCardGroupsObjs(cardRow);
        const cardGroupIndex = cardGroupObjs.findIndex((c) => c.id === cardId);
        const cardGroupsToRight = cardGroupObjs.slice(cardGroupIndex + 1);

        for (let i = 0; i < cardGroupsToRight.length; i++) {
            for (let j = 0; j < cardGroupsToRight[i].cards.length; j++) {
                const card = cardGroupsToRight[i].cards[j];
                const moveCardsRightSteps = [
                    new NothingHappens(),
                    new NothingHappens(),
                    new TableToTable({
                        duration: 500,
                        fromOffset: new Offset(targetPlaceOffset),
                        fromStyles: getCardCSS(card.id, oldSnapshot),
                        toOffset: new Offset(targetPlaceOffset),
                        toStyles: getCardCSS(card.id, newSnapshot),
                        zeroOffset: "toOffset",
                    }),
                ];
                const moveCardRightTrack = new AnimationTrack({
                    cardId: card.id,
                    homePlaceId: targetPlaceId,
                    steps: moveCardsRightSteps,
                });
                moveCardsRightTracks.push(moveCardRightTrack);
            }
        }
    } else {
        const newCards = newSnapshot.players[player].places[newPlaceType].cards;
        const newCardIndex = newCards.findIndex((c) => c.id === cardId);

        const cardsToRight = newCards.slice(newCardIndex + 1);
        for (let i = 0; i < cardsToRight.length; i++) {
            const moveCardsRightSteps = [
                new NothingHappens(),
                new NothingHappens(),
                new TableToTable({
                    duration: 500,
                    fromOffset: new Offset(targetPlaceOffset),
                    fromStyles: getCardCSS(cardsToRight[i].id, oldSnapshot),
                    toOffset: new Offset(targetPlaceOffset),
                    toStyles: getCardCSS(cardsToRight[i].id, newSnapshot),
                    zeroOffset: "toOffset",
                }),
            ];
            const moveCardRightTrack = new AnimationTrack({
                cardId: cardsToRight[i].id,
                homePlaceId: targetPlaceId,
                steps: moveCardsRightSteps,
            });
            moveCardsRightTracks.push(moveCardRightTrack);
        }
    }

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

    const handToMiddleTrack = new AnimationTrack({
        cardId,
        steps: fromHandToMiddleEvents,
        homePlaceId: handId,
    }); //, naturalOffset: getOffsetOf(cardId), naturalDimensions: getDimensions(1, "GCZ")
    const middleToTableTrack = new AnimationTrack({
        cardId,
        steps: fromMiddleToTableEvents,
        homePlaceId: targetPlaceId,
    }); //  naturalOffset: getOffsetOf(cardId),  naturalDimensions: getDimensions(1, "GCZ"),

    const timeline = new MyAnimationTimeline({
        animationTracks: [handToMiddleTrack, middleToTableTrack, ...moveCardsRightTracks],
        showPrevSnapshot: [handId],
    });
    return timeline.getActiveAnimation();
};

export const createEnchantAnimation = (args: {
    cardId: number;
    handId: number;
    targetCardId: number;
    targetPlaceId: number;
    oldSnapshot: GameSnapshot;
    newSnapshot: GameSnapshot;
    offsetMap: { [key: number]: { dx: number; dy: number } };
}): ActiveAnimation => {
    const { cardId, handId, targetCardId, targetPlaceId, oldSnapshot, newSnapshot, offsetMap } =
        args;
    const handOffset = offsetMap[handId];
    const targetPlaceOffset = offsetMap[targetPlaceId];
    if (!targetPlaceOffset) {
        throw new Error("Offset not found for target card with id of " + targetCardId);
    }
    // assumption: the targetPlace will position its children at its
    // absolute top left, then apply any styles they have.

    const fromHandToMiddleSteps = [
        new HandToMiddle({
            fromOffset: new Offset(handOffset),
            fromStyles: getCardCSS(cardId, oldSnapshot),
            toOffset: getMiddleOffset(),
            toStyles: getMiddleStyles(),
            zeroOffset: "fromOffset",
            duration: 500,
        }),
        new FromDisappears({ visibility: "disappearing" }),
        new NothingHappens(),
    ];

    const fromMiddleToTableSteps = [
        new NothingHappens(),
        new ToAppears({ visibility: "appearing" }),
        new MiddleToTable({
            duration: 500,
            toOffset: new Offset(targetPlaceOffset),
            toStyles: getCardCSS(cardId, newSnapshot), // NOTE NEW_SNAPSHOT!,
            fromOffset: getMiddleOffset(),
            fromStyles: getMiddleStyles(),
            zeroOffset: "toOffset",
        }),
    ];
    const { placeType: newPlaceType, player } = locateCard(targetCardId, newSnapshot);
    if (player === null) throw new Error("Player cannot be null");
    const cardRow = newSnapshot.players[player].places[newPlaceType].cards;
    const cardGroupObjs = getCardGroupsObjs(cardRow);
    const cardGroup = cardGroupObjs.find((g) => g.cards.map(c => c.id).includes(targetCardId));
    if (!cardGroup) throw new Error("Card group not found");
    const cardsToEnchant = cardGroup.cards.filter(c => c.cardType !== "bff" && c.cardType !== "enchant");
    const cardsToEnchantTracks = [];
    for (let i = 0; i < cardsToEnchant.length; i++) {
        const card = cardsToEnchant[i];
        const cardToEnchantSteps = [
            new NothingHappens(),
            new NothingHappens(),
            new AnimationTrackStep({
                fromOffset: new Offset(targetPlaceOffset),
                fromStyles: getCardCSS(card.id, oldSnapshot),
                toOffset: new Offset(targetPlaceOffset),
                toStyles: getCardCSS(card.id, oldSnapshot),
                zeroOffset: "fromOffset",
            }),
        ];
        const cardToEnchantTrack = new AnimationTrack({
          cardId: card.id,
          steps: cardToEnchantSteps,
          homePlaceId: targetPlaceId,
      });
      cardsToEnchantTracks.push(cardToEnchantTrack);
    }
    const handToMiddleTrack = new AnimationTrack({
        cardId,
        steps: fromHandToMiddleSteps,
        homePlaceId: handId,
    });
    const middleToTableTrack = new AnimationTrack({
        cardId,
        steps: fromMiddleToTableSteps,
        homePlaceId: targetPlaceId,
    });
    

    const timeline = new MyAnimationTimeline({
        animationTracks: [handToMiddleTrack, middleToTableTrack, ...cardsToEnchantTracks],
        showPrevSnapshot: [handId],
    });
    return timeline.getActiveAnimation();
};

export interface DealCardsArgs {
    cardIds: number[];
    deckId: number;
    handId: number;
    oldSnapshot: GameSnapshot;
    newSnapshot: GameSnapshot;
    offsetMap: { [key: number]: { dx: number; dy: number } };
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
        const middleZIndex = dimensionConstants.ANIMATED_CARDS_Z_INDEX;
        // Set the zIndex to increase with each iteration so that later cards are above earlier cards
        middleStylesWithZIndex["z-index"] = `${middleZIndex + 5 + i}`;
        const handStylesWithZIndex = getCardCSS(cardId, newSnapshot);
        // Set the zIndex to lower than cards leaving deck but all at the same so they naturally
        // fall where they should
        const leftNum = parseInt(handStylesWithZIndex["left"].replace("px", ""));
        handStylesWithZIndex["z-index"] = `${middleZIndex}`;
        // This amount is for card spread amount
        const playerHandOffset = isStartGast ? 0 : getPlayerHandOffset(cardIds.length);
        handStylesWithZIndex["left"] = `${
            leftNum + dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD * i + playerHandOffset
        }px`; // handCardSpread

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
            new AnimationTrackStep({ duration: isStartGast ? 0 : (7 - i) * 520 }),
        ];

        const handToMiddleTrack = new AnimationTrack({
            cardId,
            steps: deckToMiddle,
            homePlaceId: deckId,
        }); //, naturalOffset: getOffsetOf(cardId), naturalDimensions: getDimensions(1, "GCZ")
        const middleToTableTrack = new AnimationTrack({
            cardId,
            steps: middleToHand,
            homePlaceId: handId,
        }); //  naturalOffset: getOffsetOf(cardId),  naturalDimensions: getDimensions(1, "GCZ"),

        const delay = i * dimensionConstants.DELAY_BETWEEN_DEALT_CARDS;

        const { animationData, totalDuration } = new MyAnimationTimeline({
            animationTracks: [handToMiddleTrack, middleToTableTrack],
            startDelay: delay,
            showPrevSnapshot: [handId],
        });
        animations.push(...animationData);
        durationOfAllAnimations = totalDuration;
        if (!isStartGast) durationOfAllAnimations -= 700; // End before other animations end and return to their incorrect places
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
        const middleZIndex = dimensionConstants.ANIMATED_CARDS_Z_INDEX;
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

        const handToMiddleTrack = new AnimationTrack({
            cardId,
            steps: deckToHand,
            homePlaceId: handId,
        }); //, naturalOffset: getOffsetOf(cardId), naturalDimensions: getDimensions(1, "GCZ")

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
};

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
    const {
        handCardId,
        handId,
        discardPileId,
        GCZCardId,
        GCZId,
        oldSnapshot,
        newSnapshot,
        placeRefMap,
    } = args;
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
    const handToMiddleTrack = new AnimationTrack({
        cardId: handCardId,
        homePlaceId: handId,
        steps: fromHandToMiddleEvents,
    });
    const middleToTargetCardTrack = new AnimationTrack({
        cardId: handCardId,
        homePlaceId: undefined,
        steps: fromMiddleToTargetCardEvents,
    });
    const targetCardToDiscardTrack = new AnimationTrack({
        cardId: handCardId,
        homePlaceId: discardPileId,
        steps: fromTargetCardToDiscardEvents,
    });

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

    const gczToDiscardTrack = new AnimationTrack({
        cardId: GCZCardId,
        homePlaceId: discardPileId,
        steps: fromGCZToDiscard,
    });

    const timeline = new MyAnimationTimeline({
        showPrevSnapshot: [handId, GCZId],
        animationTracks: [
            gczToDiscardTrack,
            handToMiddleTrack,
            middleToTargetCardTrack,
            targetCardToDiscardTrack,
        ],
    });
    timeline.addHideTrack(GCZCardId, GCZId);
    return timeline.getActiveAnimation();
};

export const createRearrangeAnimation = (args: {
    cardIds: number[];
    placeId: number;
    oldSnapshot: GameSnapshot;
    newSnapshot: GameSnapshot;
    offsetMap: { [key: number]: { dx: number; dy: number } };
}): ActiveAnimation => {
    const { cardIds, placeId, oldSnapshot, newSnapshot, offsetMap } = args;
    const place = offsetMap[placeId];
    if (!place) {
        throw new Error("Offset not found for place with id of " + placeId);
    }
    const { placeType, player } = locateCard(cardIds[0], oldSnapshot);
    if (player === null) throw new Error("Player cannot be null");

    const moveCardsTracks = [];

    if (placeType === "guestCardZone") {
        const newCardRow = newSnapshot.players[player].places[placeType].cards;
        const oldCardRow = oldSnapshot.players[player].places[placeType].cards;
        const newCardGroupObjs = getCardGroupsObjs(newCardRow);
        const oldCardGroupObjs = getCardGroupsObjs(oldCardRow);
        for (let i = 0; i < newCardGroupObjs.length; i++) {
            const cardGroupNew = oldCardGroupObjs.find((c) => c.id === newCardGroupObjs[i].id);
            if (!cardGroupNew) throw new Error("Card group not found");
            for (let j = 0; j < cardGroupNew.cards.length; j++) {
                const card = cardGroupNew.cards[j];
                const moveCardStep = new TableToTable({
                    duration: 500,
                    fromOffset: new Offset(place),
                    fromStyles: getCardCSS(card.id, oldSnapshot),
                    toOffset: new Offset(place),
                    toStyles: getCardCSS(card.id, newSnapshot),
                    zeroOffset: "toOffset",
                });

                const moveCardTrack = new AnimationTrack({
                    cardId: card.id,
                    homePlaceId: placeId,
                    steps: [moveCardStep],
                });
                moveCardsTracks.push(moveCardTrack);
            }
        }
    } else {
        throw new Error("Only GCZ is supported for rearranging for now");
    }

    const timeline = new MyAnimationTimeline({
        showPrevSnapshot: [],
        animationTracks: [...moveCardsTracks],
    });
    return timeline.getActiveAnimation();
};
