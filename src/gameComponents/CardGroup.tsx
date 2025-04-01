import { Draggable, Droppable } from "react-beautiful-dnd";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";
import { useSelector } from "react-redux";
import { dimensionConstants, getCardGroupStyles } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import GhostCard from "./GhostCard";
import { locateCard } from "../helperFunctions/locateFunctions";
import AnimatedCardGroup from "./AnimatedCardGroup";

export interface NewCardGroupProps {
    cardGroup: NewCardGroupObj;
    cardGroupIndex: number;
    // physicalIndex: number; // how many cards from the left
    gameSnapshot: GameSnapshot;
    placeId: number;
    rightMostEnchantable: boolean;
}

interface BFFOrZwillingCardGroup {
    cardGroup: CardGroupObj;
    draggableId: string;
    cardGroupIndex: number;
    notAmongHighlights?: boolean;
}

const NewCardGroup: React.FC<NewCardGroupProps> = ({
    cardGroup,
    cardGroupIndex,
    // physicalIndex,
    gameSnapshot,
    placeId,
    rightMostEnchantable,
}) => {
    const { draggedOver, draggedHandCard, highlights, highlightType } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
    const isHighlighted = cardGroup.cards.every((card) => highlights.includes(card.id));
    const notAmongHighlights = highlightType === "card" && !isHighlighted;
    console.log("highlightType", highlightType, "isHighlighted", isHighlighted, "notAmongHighlights", notAmongHighlights);
    const { cardWidth } = getCardGroupStyles(cardGroup, cardGroupIndex, gameSnapshot);
    const draggableData: DraggableData = {
        id: cardGroup.id,
        type: "cardGroup",
        numCards: cardGroup.cards.length,
    };
    const draggableId = JSON.stringify(draggableData);

    const droppableData: DroppableData = {
        type: "cardGroup",
        id: cardGroup.id,
        calculatedIndex: cardGroup.index + 1,
        player: locateCard(cardGroup.id, gameSnapshot).player ?? 0,
        placeType: "guestCardZone",
    };

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    const animated: { [key: number]: boolean } = {};
    cardGroup.cards.forEach((c) => {
        animated[c.id] = animationCardIds.includes(c.id);
    });
    const allAreAnimated = Object.values(animated).every((a) => a);
    const noneAreAnimated = Object.values(animated).every((a) => !a);
    if (!allAreAnimated && !noneAreAnimated) {
        console.log("animated: ", animated);
        throw new Error("Some cards in CardGroup are animated and some are not!!!");
    }

    const droppableId = JSON.stringify(droppableData);

    const ghostCardInPlace = draggedOver?.id === cardGroup.id;
    const ghostCard = draggedHandCard && ghostCardInPlace ? draggedHandCard : undefined;

    let ghostCardOffsetLeft = 0;
    if (rightMostEnchantable && ghostCard?.cardType === "bff") {
        ghostCardOffsetLeft = -cardWidth / 2;
    } else if (ghostCard?.cardType === "bff") {
        ghostCardOffsetLeft = cardWidth / 2;
    }

    if (allAreAnimated) {
        return (
            <AnimatedCardGroup
                key={cardGroup.id}
                cardGroup={cardGroup}
                currAnimations={animations.filter(
                    (a) =>
                        cardGroup.cards.map((c) => c.id).includes(a.cardId) && a.placeId === placeId
                )}
                gameSnapshot={gameSnapshot}
            />
        );
    }

    if (cardGroup.cards.length === 1) {
        return (
            <SingleCardGroup
                cardGroup={cardGroup}
                cardGroupIndex={cardGroupIndex}
                draggableId={draggableId}
                draggedHandCard={draggedHandCard}
                droppableId={droppableId}
                ghostCard={ghostCard}
                isHighlighted={isHighlighted}
                ghostCardOffsetLeft={ghostCardOffsetLeft}
                notAmongHighlights={notAmongHighlights}
            />
        );
    }

    if (cardGroup.cards.length === 2)
        return (
            <ZwillingCardGroup
                cardGroup={cardGroup}
                cardGroupIndex={cardGroupIndex}
                draggableId={draggableId}
                notAmongHighlights={notAmongHighlights}
            />
        );
    else
        return (
            <BFFCardGroup
                cardGroup={cardGroup}
                cardGroupIndex={cardGroupIndex}
                draggableId={draggableId}
                notAmongHighlights={notAmongHighlights}
            />
        );
};

interface SingleCardGroupProps {
    cardGroup: CardGroupObj;
    draggableId: string;
    cardGroupIndex: number;
    droppableId: string;
    ghostCard: GameCard | undefined;
    draggedHandCard: GameCard | undefined;
    isHighlighted: boolean;
    ghostCardOffsetLeft?: number;
    notAmongHighlights?: boolean;
}

const SingleCardGroup: React.FC<SingleCardGroupProps> = ({
    cardGroup,
    draggableId,
    cardGroupIndex,
    droppableId,
    ghostCard,
    draggedHandCard,
    isHighlighted,
    ghostCardOffsetLeft,
    notAmongHighlights,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardHeight } = getCardGroupStyles(cardGroup, cardGroupIndex, currSnapshot);
    return (
        <Draggable draggableId={draggableId} index={cardGroupIndex}>
            {(d) => (
                <Droppable droppableId={droppableId} isDropDisabled={!isHighlighted}>
                    {(drop) => (
                        <div
                            {...drop.droppableProps}
                            ref={drop.innerRef}
                            key={cardGroup.cards[0].id + "droppable"}
                        >
                            <img
                                {...d.draggableProps}
                                ref={d.innerRef}
                                {...d.dragHandleProps}
                                src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                                alt={cardGroup.cards[0].imageName}
                                draggable="false"
                                style={{
                                    // position: "relative",
                                    height: cardHeight,
                                    zIndex: 99,
                                    ...d.draggableProps.style,
                                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                    WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                                    filter: notAmongHighlights ? "grayscale(100%)" : "",
                                    transition: "filter 250ms",
                                }}
                            />
                            {ghostCard && draggedHandCard && (
                                <GhostCard
                                    cardId={draggedHandCard.id}
                                    index={cardGroupIndex}
                                    imageName={draggedHandCard.imageName}
                                    zIndex={0}
                                    offsetTop={cardHeight / 2}
                                    offsetLeft={ghostCardOffsetLeft}
                                />
                            )}
                            {drop.placeholder}
                        </div>
                    )}
                </Droppable>
            )}
        </Draggable>
    );
};

const ZwillingCardGroup: React.FC<BFFOrZwillingCardGroup> = ({
    cardGroup,
    draggableId,
    cardGroupIndex,
    notAmongHighlights,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const {  cardWidth, cardHeight } = getCardGroupStyles(
        cardGroup,
        cardGroupIndex,
        currSnapshot
    );

    return (
        <Draggable
            draggableId={draggableId}
            index={cardGroupIndex}
        >
            {(d) => (
                <div {...d.draggableProps} ref={d.innerRef} {...d.dragHandleProps}>
                    <div
                        style={{
                            height: cardHeight * 1.5,
                            width: cardWidth,
                            position: "relative",
                            WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                            filter: notAmongHighlights ? "grayscale(100%)" : "",
                        }}
                    >
                        <img
                            src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                            alt={cardGroup.cards[0].imageName}
                            style={{
                                position: "absolute",
                                height: cardHeight,
                                width: cardWidth,
                                left: 0,
                                top: 0,
                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                                filter: notAmongHighlights ? "grayscale(100%)" : "",
                                transition: "filter 250ms",

                            }}
                        />

                        <img
                            src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                            alt={cardGroup.cards[1].imageName}
                            style={{
                                position: "absolute",
                                left: 0,
                                top: cardHeight / 2,
                                height: cardHeight,
                                width: cardWidth,
                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                                filter: notAmongHighlights ? "grayscale(100%)" : "",
                                transition: "filter 250ms",

                            }}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

const BFFCardGroup: React.FC<BFFOrZwillingCardGroup> = ({
    cardGroup,
    draggableId,
    cardGroupIndex,
    notAmongHighlights,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardWidth, cardHeight } = getCardGroupStyles(
        cardGroup,
        cardGroupIndex,
        currSnapshot,
    );
    return (
        <Draggable
            draggableId={draggableId}
            index={cardGroupIndex}
            // index={index}
        >
            {(d) => (
                <div {...d.dragHandleProps} {...d.draggableProps} ref={d.innerRef}>
                    <div
                        style={{
                            height: cardHeight * 1.5,
                            width: cardWidth * 2,
                            position: "relative",
                        }}
                    >
                        <img
                            src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                            alt={cardGroup.cards[0].imageName}
                            style={{
                                position: "absolute",
                                height: cardHeight,
                                left: 0,
                                top: 0,
                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                                filter: notAmongHighlights ? "grayscale(100%)" : "",
                                transition: "filter 250ms",

                            }}
                        />
                        <img
                            src={`./images/${cardGroup.cards[2].imageName}.jpg`}
                            alt={cardGroup.cards[2].imageName}
                            style={{
                                position: "absolute",
                                left: cardWidth,
                                top: 0,
                                height: cardHeight,
                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                                filter: notAmongHighlights ? "grayscale(100%)" : "",
                                transition: "filter 250ms",

                            }}
                        />
                        <img
                            src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                            alt={cardGroup.cards[1].imageName}
                            style={{
                                position: "absolute",
                                left: cardWidth / 2,
                                top: cardHeight / 2,
                                height: cardHeight,
                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                                filter: notAmongHighlights ? "grayscale(100%)" : "",
                                transition: "filter 250ms",

                            }}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default NewCardGroup;
