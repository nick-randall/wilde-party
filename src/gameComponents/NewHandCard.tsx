import { useSelector } from "react-redux";
import {
    dimensionConstants,
    getCardIsFaceup,
    getCardStyles,
    getCardStyleValues,
} from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import {
    Draggable,
    DraggableProvidedDraggableProps,
    DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { CSSProperties } from "react";

export interface NewHandCardProps {
    id: number;
    index: number;
    imageName: string;
    // styles: CardDimensions;
    hover: boolean;
    setHover: (hover: boolean) => void;

    numHandCards: number;
}

export const NewHandCard: React.FC<NewHandCardProps> = ({
    id,
    index,
    imageName,
    hover,
    setHover,
    numHandCards,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);

    const styles = getCardStyles(id, currSnapshot);
    const cardIsFaceup = getCardIsFaceup(id, currSnapshot);
    const draggableData: DraggableData = { id, type: "handCard" };
    const draggableId = JSON.stringify(draggableData);
    const isDragging = useSelector(
        (state: RootState) =>
            state.dragEventState.draggedHandCard !== undefined &&
            state.dragEventState.draggedHandCard.id === id
    );
    const { draggedHandCard, BFFdraggedOverSide, highlightType, draggedOver } = useSelector(
        (state: RootState) => state.dragEventState
    );
    // const isDraggedOverAnyPlace = draggedOver !== undefined;
    // const droppingStyles = (snapshot: DraggableStateSnapshot, style: DraggableProvidedDraggableProps) => {
    //   if (!snapshot.isDropAnimating || !isDraggedOverAnyPlace) {
    //     return style;
    //   }
    //   if (snapshot.dropAnimation) {
    //     const { curve, duration, moveTo } = snapshot.dropAnimation;
    //     let x = moveTo.x;
    //     let y = moveTo.y;
    //     console.log(moveTo);
    //     if (highlightType === "card") {
    //       if (draggedHandCard && draggedHandCard.cardType === "bff") {
    //         x = BFFdraggedOverSide === "left" ? -60 : 40;
    //       } else x = -15;
    //       y = 60;
    //     } else if (draggedHandCard && (draggedHandCard.cardType === "special" || draggedHandCard.cardType === "unwanted")) {
    //       x = -15;
    //       y = -15;
    //     } else {
    //       // x = cardWidth - 175;
    //       // y = cardHeight - 195;
    //     }

    //     const translate = `translate(${x}px, ${y}px)`;
    //     const scale = `scale(${dimensionConstants.HAND_TO_TABLE_SCALE_FACTOR})`;
    //     return {
    //       ...style,
    //       transform: `${translate} ${scale}`,
    //       transition: `all ${curve} ${duration + 0.5}s`,
    //     };
    //   }
    // };

    const dragStyles = (isDragging: boolean | undefined): CSSProperties =>
        isDragging
            ? {
                  transform: `rotate(0deg)`,
                  // This width causes cards to move aside and make room in other droppables.
                  // When not dragging it tucks cards together

                  // height: 168,
                  // width: 105,
                  // left: 125 * (index - (numHandCards / 2 - 0.5))
              }
            : {};

    const leftSpreadFactor = hover || draggedHandCard?.id === id ? 3 : 1;
    const leftSpreadCorrection =
        hover || draggedHandCard?.id === id
            ? (numHandCards - 1) * dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD
            : 0;

    let left = styles.left;
    if (typeof left === "string") {
        const re = /(\d+)/;
        const leftNumbers = left.match(re);
        let leftNum = leftNumbers ? parseInt(leftNumbers[0]) : 0;
        left = `${leftNum * leftSpreadFactor - leftSpreadCorrection}px`;
    }

    return (
        <Draggable draggableId={draggableId} index={index}>
            {(d) => (
                <div {...d.draggableProps} ref={d.innerRef} {...d.dragHandleProps}>
                    <img
                        src={`./${
                            cardIsFaceup ? `./images/${imageName}.jpg` : "./images/back.jpg"
                        }`}
                        alt="id"
                        draggable={false}
                        style={{ ...styles, left, ...dragStyles(isDragging) }} // TODO change cardHeight name to height
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    />
                </div>
            )}
        </Draggable>
    );
};
