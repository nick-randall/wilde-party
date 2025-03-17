// export const x = "c";

import { CSSProperties, useState } from "react";
import {
    Draggable,
    DraggableProvidedDraggableProps,
    DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getUserPhase } from "../gameSnapshotState/gameSnapshotSelectors";
import {
    dimensionConstants,
    getCardStyleValues,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";

export interface HandCardProps {
    id: number;
    index: number;
    image: string;
    numHandCards: number;
    // onEnter: () => void;
    // onLeave: () => void;
}

const HandCard = (props: HandCardProps) => {
    const { id, index, image } = props;

    const isDragging = useSelector(
        (state: RootState) =>
            state.dragEventState.draggedHandCard !== undefined &&
            state.dragEventState.draggedHandCard.id === id
    );
    const { draggedOver, draggedHandCard } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const isDraggedOverAnyPlace = draggedOver !== undefined;
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { zIndex, cardWidth, rotate, top, cardHeight } = getCardStyleValues(id, currSnapshot);
    const draggableData: DraggableData = { id, type: "handCard" };
    const draggableId = JSON.stringify(draggableData);

    const phase = useSelector(getUserPhase);

    const canPlay = phase === "playing" || phase === "drawing";

    const [shortHover, setShortHover] = useState(false);
    // This no longer seems necessary so set it to 0
    const pushLeftWhileDragging = dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD * 3;

    const dragStyles = (isDragging: boolean | undefined): CSSProperties =>
        isDragging
            ? {
                  transform: `rotate(0deg)`,
                  // This width causes cards to move aside and make room in other droppables.
                  // When not dragging it tucks cards together

                  // height: 168,
                  // width: 105,
                  //left: 125 * (index - (numHandCards / 2 - 0.5))
                  left: -pushLeftWhileDragging,
              }
            : {};
    const normalStyles: CSSProperties = {
        // should be in dimensions
        zIndex: shortHover ? 30 : zIndex,
        width: cardWidth,
        height: cardHeight,
        top: index * top,
        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
        left: 0, // 30 * index,
        position: "absolute",
        transform: `rotate(${rotate}deg) scale(${shortHover ? 1.1 : 1})`,
        transition: `width 180ms, transform 180ms`,
        pointerEvents: "auto",
        boxShadow: "10px 10px 10px black",
    };

    const droppingStyles = (
        snapshot: DraggableStateSnapshot,
        style: DraggableProvidedDraggableProps
    ) => {
        if (!snapshot.isDropAnimating || !isDraggedOverAnyPlace) {
            return style;
        }

        if (snapshot.dropAnimation) {
            const { curve, duration, moveTo } = snapshot.dropAnimation;
            let x = pushLeftWhileDragging; //moveTo.x;
            let y = 0; //moveTo.y;
            if (draggedHandCard?.imageName === "zwilling" && draggedOver) {
                const cardHeight = getCardStyleValuesFromPlaceAndPlayer(
                    draggedOver.placeType || "guestCardZone",
                    draggedOver.player || 0,
                    currSnapshot
                ).cardHeight;
                y += cardHeight / 2;
            }
            else if (draggedHandCard?.cardType === "bff" && draggedOver) {
                const {cardHeight, cardWidth} = getCardStyleValuesFromPlaceAndPlayer(
                    draggedOver.placeType || "guestCardZone",
                    draggedOver.player || 0,
                    currSnapshot
                );
                y += cardHeight / 2;

                let targetIsRightmostEnchantable = false;
                const actionResultsMap = currSnapshot.actionResultsMap;

                if (actionResultsMap) {
                    const actionResults = actionResultsMap[id];
                    const target = actionResults.find(
                        (res) =>
                            res.snapshotUpdateData.targetId === draggedOver.id &&
                            res.snapshotUpdateData.secondaryCardId !== null
                    );
                    if (target) targetIsRightmostEnchantable = true;
                }
                x += targetIsRightmostEnchantable ? -cardWidth / 2 : cardWidth / 2;
                console.log("targetIsRightmostEnchantable", targetIsRightmostEnchantable,"x", x);
            }
            const translate = `translate(${x}px, ${y}px)`;
            const scale = `scale(${0.83})`;
            // const scale = `scale(1)`;
            return {
                ...style,
                transformOrigin: "top left",
                transform: `${translate} ${scale}`,
                transition: `all ${curve} ${duration + 0.5}s`,
            };
        }
    };

    const endShortAndLongHover = (handleMouseLeave: Function) => {
        handleMouseLeave();
        setShortHover(false);
    };

    const tableCardHeight = dimensionConstants.TABLE_CARD_HEIGHTS["self"];
    const tableCardWidth = tableCardHeight / dimensionConstants.HEIGHT_TO_WIDTH_RATIO;

    return (
        <Draggable
            draggableId={draggableId}
            index={index}
            key={draggableId}
            isDragDisabled={!canPlay}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    // style={isDragging ? provided.draggableProps.style?.transform?.replace("")}
                >
                    <div
                        // The width of this element determines how far cards
                        // move aside and make room in other droppables.
                        // When not dragging it has a width of 0, which
                        // tucks hand cards together
                        style={{ width: isDragging ? tableCardWidth : 0 }}
                    >
                        <img
                            alt={image}
                            src={`./images/${image}.jpg`}
                            draggable="false"
                            // ref={cardRef}
                            // onMouseEnter={onEnter}
                            // onMouseLeave={onLeave}

                            onMouseEnter={() => setShortHover(true)}
                            onMouseLeave={() => setShortHover(false)}
                            id={id.toString()}
                            style={{
                                ...normalStyles,
                                ...dragStyles(isDragging),
                                ...droppingStyles(snapshot, provided.draggableProps),
                            }}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    );
};
export default HandCard;
