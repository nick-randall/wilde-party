import { CSSProperties, useState } from "react";
import { Draggable, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";
import Dragger from "./dndcomponents/Dragger";

export interface HandCardProps {
  id: string;
  handId: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  spread: number;
}

const HandCard = (props: HandCardProps) => {
  const { id, index, image, dimensions, handId, spread, numHandCards } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, cardHeight } = dimensions;

  // const isDragging = useSelector((state: RootState) => state.draggedHandCard !== undefined && state.draggedHandCard.id === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const isDraggedOverAnyPlace = useSelector((state: RootState) => state.dragUpdate.droppableId !== "");

  const highlightType = useSelector((state: RootState) => state.highlightType);
  const transitionUnderway = useSelector((state: RootState) => state.transitionData.length > 0);

  const { player, phase } = useSelector((state: RootState) => state.gameSnapshot.current);

  const canPlay = player === 0 && phase === "playPhase" && !transitionUnderway;

  const [shortHover, setShortHover] = useState(false);

  const dragStyles = (isDragging: boolean | undefined): CSSProperties =>
    isDragging
      ? {
          left: "",
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
    zIndex: shortHover ? 30 : tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    top: index * cardTopSpread,
    left: spread * index - (spread * numHandCards) / 2,
    position: "absolute",
    transform: `rotate(${rotation(index)}deg) scale(${shortHover ? 1.1 : 1})`,
    transition: `left 250ms, width 180ms, transform 180ms`,
    pointerEvents: "auto",
    boxShadow: "10px 10px 10px black",
  };

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
  //         x = BFFDraggedOverSide === "left" ? -60 : 40;
  //       } else x = -15;
  //       y = 60;
  //     } else if (draggedHandCard && (draggedHandCard.cardType === "special" || draggedHandCard.cardType === "unwanted")) {
  //       x = -15;
  //       y = -15;
  //     } else {
  //       x = cardWidth - 175;
  //       y = cardHeight - 195;
  //     }

  //     const translate = `translate(${x}px, ${y}px)`;
  //     const scale = `scale(${dimensions.handToTableScaleFactor})`;
  //     return {
  //       ...style,
  //       transform: `${translate} ${scale}`,
  //       transition: `all ${curve} ${duration + 0.5}s`,
  //     };
  //   }
  // };

  const endShortAndLongHover = (handleMouseLeave: Function) => {
    handleMouseLeave();
    setShortHover(false);
  };

  return (
    <Dragger draggerId={id} index={index} key={id} isDragDisabled={!canPlay} containerId={handId} isOutsideContainer>
      {draggerRenderProps => (
        //  <div style= {{left: spread * index - (spread * numHandCards) / 2, position:"absolute"}}>
        <CardInspector
          dimensions={dimensions}
          cardRotation={10 * index - rotation(index)}
          render={(cardRef, handleClick, handleMouseLeave, inspectedStyles) => (
            <TransitionHandler
              index={index}
              id={id}
              render={(transitionStyles: CSSProperties) => (
                <img
                  alt={image}
                  src={`./images/${image}.jpg`}
                  draggable="false"
                  ref={draggerRenderProps.draggerRef}
                  onClick={handleClick}
                  onMouseDown={draggerRenderProps.handleDragStart}
                  onMouseEnter={() => setShortHover(true)}
                  onMouseLeave={() => endShortAndLongHover(handleMouseLeave)}
                  id={id}
                  style={{
                    ...normalStyles,
                    ...inspectedStyles,
                    ...dragStyles(draggerRenderProps.isDragging),
                    ...transitionStyles,
                    // ...droppingStyles(snapshot, provided.draggableProps),
                  }}
                />
              )}
            />
          )}
        />
      )}
    </Dragger>
  );
};
export default HandCard;
