import { CSSProperties, useState } from "react";
import { Draggable, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import {  useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CardInspector } from "../renderPropsComponents/CardInspector";
import { get } from "http";
import { dimensionConstants, getCardStyleValues } from "../helperFunctions/getCardStyles";
import { getUserPhase } from "../gameSnapshotState/gameSnapshotSelectors";

export interface HandCardProps {
  id: number;
  index: number;
  imageName: string;
  numHandCards: number;
}

const HandCard = (props: HandCardProps) => {
  const { id, index, imageName } = props;
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);  
  const styles = getCardStyleValues(id, currSnapshot)

  const { zIndex, cardWidth, top: cardTopSpread, rotate, cardHeight, left } = styles;
  const draggableData: DraggableData = { id, type: "handCard" };
  const draggableId = JSON.stringify(draggableData);

  const isDragging = useSelector((state: RootState) => state.dragEventState.draggedHandCard !== undefined && state.dragEventState.draggedHandCard.id === id);
  const {draggedHandCard, BFFdraggedOverSide, highlightType, draggedOver} = useSelector((state: RootState) => state.dragEventState);
  const isDraggedOverAnyPlace = draggedOver !== undefined;

  const currAnimation = useSelector((state: RootState) => state.animationState.activeAnimation);
  const { player } = useSelector((state: RootState) => state.gameSnapshotState.currSnapshot.current);
  const phase = useSelector(getUserPhase);

  const canPlay = phase !== "notMyTurn" &&  !currAnimation// player === 0 && phase === "playPhase" && !transitionUnderway;

  const [shortHover, setShortHover] = useState(false);

  const dragStyles = (isDragging: boolean | undefined): CSSProperties =>
    isDragging
      ? {
          transform: `rotate(0deg)`,
          // This width causes cards to move aside and make room in other droppables.
          // When not dragging it tucks cards together

          // height: 168,
          // width: 105,
          //left: 125 * (index - (numHandCards / 2 - 0.5))
        }
      : {};
  const normalStyles: CSSProperties = {
    // should be in dimensions
    zIndex: shortHover ? 30 : zIndex,
    width: cardWidth,
    height: cardHeight,
    top: index * cardTopSpread,
    left: left,
    position: "absolute",
    transform: `rotate(${rotate}deg) scale(${shortHover ? 1.1 :1})`,
    transition: `left 250ms, width 180ms, transform 180ms`,
    pointerEvents: "auto",
    boxShadow: "10px 10px 10px black",
  };

  const droppingStyles = (snapshot: DraggableStateSnapshot, style: DraggableProvidedDraggableProps) => {
    if (!snapshot.isDropAnimating || !isDraggedOverAnyPlace) {
      return style;
    }
    if (snapshot.dropAnimation) {
      const { curve, duration, moveTo } = snapshot.dropAnimation;
      let x = moveTo.x;
      let y = moveTo.y;
      console.log(moveTo);
      if (highlightType === "card") {
        if (draggedHandCard && draggedHandCard.cardType === "bff") {
          x = BFFdraggedOverSide === "left" ? -60 : 40;
        } else x = -15;
        y = 60;
      } else if (draggedHandCard && (draggedHandCard.cardType === "special" || draggedHandCard.cardType === "unwanted")) {
        x = -15;
        y = -15;
      } else {
        x = cardWidth - 175;
        y = cardHeight - 195;
      }

      const translate = `translate(${x}px, ${y}px)`;
      const scale = `scale(${dimensionConstants.HAND_TO_TABLE_SCALE_FACTOR})`;
      return {
        ...style,
        transform: `${translate} ${scale}`,
        transition: `all ${curve} ${duration + 0.5}s`,
      };
    }
  };

  const endShortAndLongHover = (handleMouseLeave: Function) => {
    handleMouseLeave();
    setShortHover(false);
  };

  return (
    <Draggable draggableId={draggableId} index={index} key={id} isDragDisabled={!canPlay}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            // The width of this element determines how far cards
            // move aside and make room in other droppables.
            // When not dragging it has a width of 0, which
            // tucks hand cards together
            style={{ width: isDragging ? styles.cardWidth : 0, position: "relative" }}
          >
            <CardInspector
              dimensions={styles}
              cardRotation={rotate}
              render={(cardRef, handleClick, handleMouseLeave, inspectedStyles) => (
              
                    <img
                      alt={imageName}
                      src={`./images/${imageName}.jpg`}
                      draggable="false"
                      ref={cardRef}
                      onClick={handleClick}
                      onMouseEnter={()=>setShortHover(true)}
                      onMouseLeave={() => endShortAndLongHover(handleMouseLeave)}
                      style={{
                        ...normalStyles,
                        ...inspectedStyles,
                        ...dragStyles(isDragging),
                        ...droppingStyles(snapshot, provided.draggableProps),
                      }}
                    />
                  )}
                />
       
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default HandCard;
