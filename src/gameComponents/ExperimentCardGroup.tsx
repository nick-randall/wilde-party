import { Draggable, Droppable } from "react-beautiful-dnd";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";
import { useSelector } from "react-redux";
import { dimensionConstants, getCardGroupStyles } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import GhostCard from "./GhostCard";
import { getCard, locateCard } from "../helperFunctions/locateFunctions";

export interface NewCardGroupProps {
    cardGroup: NewCardGroupObj;
    cardGroupIndex: number;
    physicalIndex: number; // how many cards from the left
    // enchantableNeighbours: EnchantableNeighbour[];
}

const ExperimentCardGroup: React.FC<NewCardGroupProps> = ({
    cardGroup,
    cardGroupIndex,
    physicalIndex,
}) => {
    const { draggedOver, rearrangingData, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const isHighlighted = highlights.includes(cardGroup.id);
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { left, cardWidth, cardHeight } = getCardGroupStyles(
        cardGroup,
        physicalIndex,
        currSnapshot
    );
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

        // enchantableNeighbours: enchantableNeighbours,
    };

    const droppableId = JSON.stringify(droppableData);

    const ghostCardInPlace = draggedOver?.id === cardGroup.id;
    const ghostCard = draggedHandCard && ghostCardInPlace ? draggedHandCard : undefined;
    if (cardGroup.cards.length === 2)
        return (
            <ZwillingCardGroup
                cardGroup={cardGroup}
                cardGroupIndex={cardGroupIndex}
                draggableId={draggableId}
                physicalIndex={physicalIndex}
            />
        );

    return (
        <Draggable
            draggableId={draggableId}
            index={cardGroupIndex}
            // index={index}
        >
            {(d) => (
                <Droppable droppableId={droppableId} isDropDisabled={!isHighlighted}>
                    {(drop) => (
                        <div
                            style={{
                                height: cardHeight,
                                width: cardWidth,
                                outline: "solid 2px green",
                            }}
                            {...drop.droppableProps}
                            ref={drop.innerRef}
                        >
                            <img
                                {...d.draggableProps}
                                ref={d.innerRef}
                                {...d.dragHandleProps}
                                src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                                alt={cardGroup.cards[0].imageName}
                                draggable="false"
                                style={{
                                    // position: "absolute",
                                    height: cardHeight,
                                    width: cardWidth,
                                    zIndex: 99,
                                    ...d.draggableProps.style,
                                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                }}
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
    );

    // <Draggable
    //     draggableId={draggableId}
    //     index={cardGroupIndex}
    //     // index={index}
    // >
    //     {(d) => (
    //         <img
    //             {...d.draggableProps}
    //             ref={d.innerRef}
    //             {...d.dragHandleProps}
    //             src={`./images/${cardGroup.cards[0].imageName}.jpg`}
    //             alt={cardGroup.cards[0].imageName}
    //             draggable="false"
    //             style={{
    //                 // position: "absolute",
    //                 height: cardHeight,
    //                 width: cardWidth,
    //                 zIndex: 99,
    //                 ...d.draggableProps.style,
    //                 borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
    //             }}
    //         />
    //     )}
    // </Draggable>
    // );
};

interface BFFOrZwillingCardGroup {
    cardGroup: CardGroupObj;
    physicalIndex: number;
    draggableId: string;
    cardGroupIndex: number;
}

const ZwillingCardGroup: React.FC<BFFOrZwillingCardGroup> = ({
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

export default ExperimentCardGroup;
