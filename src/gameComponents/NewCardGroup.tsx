import { Draggable, Droppable } from "react-beautiful-dnd";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";
import { useSelector } from "react-redux";
import { dimensionConstants, getCardGroupStyles } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import GhostCard from "./GhostCard";
import { locateCard } from "../helperFunctions/locateFunctions";
import AnimatedCard from "./AnimatedCard";
import AnimatedCardGroup from "./AnimatedCardGroup";
import { getCardName } from "../animations/animationHelperFunctions";

export interface NewCardGroupProps {
    cardGroup: NewCardGroupObj;
    cardGroupIndex: number;
    physicalIndex: number; // how many cards from the left
    gameSnapshot: GameSnapshot;
    placeId: number;
    // enchantableNeighbours: EnchantableNeighbour[];
}

const NewCardGroup: React.FC<NewCardGroupProps> = ({
    cardGroup,
    cardGroupIndex,
    physicalIndex,
    gameSnapshot,
    placeId,
}) => {
    const { draggedOver, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const isHighlighted = highlights.includes(cardGroup.id);
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardHeight } = getCardGroupStyles(cardGroup, physicalIndex, currSnapshot);
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
        player: locateCard(cardGroup.id, currSnapshot).player ?? 0,
        placeType: "guestCardZone",
    };

    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
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

    if (allAreAnimated) {
        return (
            <AnimatedCardGroup
                key={cardGroup.id}
                cardGroup={cardGroup}
                currAnimations={animations.filter((a) =>
                    cardGroup.cards.map((c) => c.id).includes(a.cardId) && a.placeId === placeId
                )}
                gameSnapshot={currSnapshot}
            />
        );
    }

    if (cardGroup.cards.length === 1) {
        return !animationCardIds.includes(cardGroup.cards[0].id) ? (
            <Draggable draggableId={draggableId} index={cardGroupIndex}>
                {(d) => (
                    <Droppable droppableId={droppableId} isDropDisabled={!isHighlighted}>
                        {(drop) => (
                            <div {...drop.droppableProps} ref={drop.innerRef}>
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
                                    }}
                                    key={cardGroup.cards[0].id}
                                />
                                {ghostCard && draggedHandCard && (
                                    <GhostCard
                                        cardId={draggedHandCard.id}
                                        index={cardGroupIndex}
                                        imageName={draggedHandCard.imageName}
                                        zIndex={0}
                                        offsetTop={cardHeight / 2}
                                    />
                                )}
                                {drop.placeholder}
                            </div>
                        )}
                    </Droppable>
                )}
            </Draggable>
        ) : (
            <AnimatedCard
                key={cardGroup.id}
                id={cardGroup.id}
                currAnimations={animations.filter(
                    (a) => a.cardId === cardGroup.id && a.placeId === placeId
                )}
                imageName={cardGroup.cards[0].imageName}
                gameSnapshot={gameSnapshot}
            />
        );
    }

    return (
        <ZwillingCardGroup
            cardGroup={cardGroup}
            cardGroupIndex={cardGroupIndex}
            draggableId={draggableId}
            physicalIndex={physicalIndex}
            animationCardIds={animationCardIds}
            animations={animations}
            placeId={placeId}
        />
    );
};

interface BFFOrZwillingCardGroup {
    cardGroup: CardGroupObj;
    physicalIndex: number;
    draggableId: string;
    cardGroupIndex: number;
    animationCardIds: number[];
    animations: AnimationData[];
    placeId: number;
}

const ZwillingCardGroup: React.FC<BFFOrZwillingCardGroup> = ({
    cardGroup,
    physicalIndex,
    draggableId,
    cardGroupIndex,
    animationCardIds,
    animations,
    placeId,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { top, cardWidth, cardHeight } = getCardGroupStyles(
        cardGroup,
        physicalIndex,
        currSnapshot
    );
    if (animationCardIds.includes(cardGroup.cards[1].id)) {
        return (
            <div>
                <img
                    src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                    alt={cardGroup.cards[0].imageName}
                    style={{
                        position: "absolute",
                        height: cardHeight,
                        // width: cardWidth,
                        left: 0,
                        top: 0,
                        zIndex: 99,
                        // ...d.draggableProps.style,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                    }}
                />
                <AnimatedCard
                    key={cardGroup.cards[1].id}
                    id={cardGroup.cards[1].id}
                    currAnimations={animations.filter(
                        (a) => a.cardId === cardGroup.cards[1].id && a.placeId === placeId
                    )}
                    imageName={cardGroup.cards[1].imageName}
                    gameSnapshot={currSnapshot}
                />
            </div>
        );
    }
    // if (animationCardIds.includes(cardGroup.cards[0].id)) {
    //     return (
    //         <AnimatedCardGroup
    //             key={cardGroup.id}
    //             cardGroupId={cardGroup.id}
    //             currAnimations={animations.filter(
    //                 (a) => a.cardId === cardGroup.id && a.placeId === placeId
    //             )}
    //             imageNames={cardGroup.cards.map((c) => c.imageName)}
    //             gameSnapshot={currSnapshot}
    //         />
    //     );
    // }

    return (
        <Draggable
            draggableId={draggableId}
            index={cardGroupIndex}
            // index={index}
        >
            {(d) => (
                <div {...d.draggableProps} ref={d.innerRef} {...d.dragHandleProps}>
                    <div
                        style={{
                            height: cardHeight * 1.5,
                            width: cardWidth,
                            // left,
                            position: "relative",
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
                                zIndex: 99,
                                // ...d.draggableProps.style,
                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                            }}
                        />
                        {!animationCardIds.includes(cardGroup.cards[1].id) && (
                            <img
                                src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                                alt={cardGroup.cards[1].imageName}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: cardHeight / 2,
                                    height: cardHeight,
                                    width: cardWidth,
                                    zIndex: 99,
                                    // ...d.draggableProps.style,
                                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                }}
                            />
                        )}
                        {animationCardIds.includes(cardGroup.cards[1].id) && (
                            <AnimatedCard
                                key={cardGroup.cards[1].id}
                                id={cardGroup.cards[1].id}
                                currAnimations={animations.filter(
                                    (a) => a.cardId === cardGroup.cards[1].id
                                )}
                                imageName={cardGroup.cards[1].imageName}
                                gameSnapshot={currSnapshot}
                            />
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

const BFFCardGroup: React.FC<BFFOrZwillingCardGroup> = ({
    cardGroup,
    physicalIndex,
    draggableId,
    cardGroupIndex,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { left, cardWidth, cardHeight } = getCardGroupStyles(
        cardGroup,
        physicalIndex,
        currSnapshot
    );
    return (
        <Draggable
            draggableId={draggableId}
            index={cardGroupIndex}
            // index={index}
        >
            {(d) => (
                <div
                    style={{
                        height: cardHeight * 1.5,
                        width: cardWidth,
                        left,
                        position: "relative",
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
                            top: cardHeight / 2,
                            zIndex: 99,
                            ...d.draggableProps.style,
                            borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        }}
                    />
                    <img
                        src={`./images/${cardGroup.cards[2].imageName}.jpg`}
                        alt={cardGroup.cards[2].imageName}
                        style={{
                            position: "absolute",
                            left: cardWidth,
                            top: cardWidth / 2,
                            height: cardHeight,
                            width: cardWidth,
                            zIndex: 99,
                            ...d.draggableProps.style,
                            borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        }}
                    />
                    <img
                        src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                        alt={cardGroup.cards[1].imageName}
                        style={{
                            position: "absolute",
                            left: cardWidth / 2,
                            top: 0,
                            height: cardHeight,
                            width: cardWidth,
                            zIndex: 99,
                            ...d.draggableProps.style,
                            borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        }}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default NewCardGroup;
