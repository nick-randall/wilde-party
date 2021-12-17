import React, { CSSProperties, useRef, useState } from "react";
import { Draggable, DraggableProps, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Transition } from "react-transition-group";
import { rotate } from "./helperFunctions/equations";
import useHoverStyles from "./hooks/useCardInspector";
import { RootState } from "./redux/store";

export interface HandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  offsetLeft?: number;
  offsetTop?: number;
  transitionData: TransitionData | undefined;
}

interface TransitionStyles {
  [status: string]: {};
}

const HandCard = (props: HandCardProps) => {
  const { id, index, image, transitionData, dimensions } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, draggedCardzIndex, cardHeight } = dimensions;
  const cardRef = useRef<HTMLImageElement>(null);
  const [centerOfCard, setCenterOfCard] = useState({ x: 40, y: 40 });
  const [touched, setTouched] = useState({ x: 40, y: 40 });

  const { setMousePosition, setHoverStyles, clearHoverStyles, hover, inspectingCenterOffset, setHover } = useHoverStyles(dimensions);
  const isDragging = useSelector((state: RootState) => state.draggedHandCard !== undefined && state.draggedHandCard.id === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const isDraggedOverAnyPlace = useSelector((state: RootState) => state.dragUpdate.droppableId !== "");

  const highlightType = useSelector((state: RootState) => state.highlightType);

  // const handleMouseMove = (event: React.MouseEvent) => {
  //   const element = cardRef.current;
  //   if (element) {
  //     const { left: boundingBoxLeft, top: boundingBoxTop, bottom: boundingBoxBottom } = element.getBoundingClientRect();
  //     setMousePosition(event, boundingBoxLeft, boundingBoxTop, boundingBoxBottom);
  //   }
  // };
  const handleClick = (event: React.MouseEvent) => {
    const element = cardRef.current;
    if (element) {
      const { left: boundingBoxLeft, top: boundingBoxTop, bottom: boundingBoxBottom, width, height } = element.getBoundingClientRect();
      setMousePosition(event, boundingBoxLeft, boundingBoxTop, boundingBoxBottom);

     
      const cardRotation = 10 * index - rotation;

      // this works! gets me the point where user clicked
      // Difference in dimensions of the card (cardWidth,cardHeight) to the Bounding Box
      // allows me to measure from topleft corner of card instead of from top left corner of Bounding Box
      const offsetOfTopLeftFromBoundingBox = { x: (width - cardWidth) / 2, y: (height - cardHeight) / 2 };
      //  A<->B
      //  -------------|
      //  |  \-----\   |
      //  |   \     \  | X
      //  |    \-----\ | |
      //  |------------| Y
      
      // also gets me the offset center
      const unrotatedCenter = { x: cardWidth / 2, y: cardHeight / 2 };

      const touchedPointInBoundingBox = {x: event.pageX - boundingBoxLeft, y: event.pageY - boundingBoxTop}

      const touchedPointOffsetFromTopLeft = { x: touchedPointInBoundingBox.x - offsetOfTopLeftFromBoundingBox.x, y: touchedPointInBoundingBox.y - offsetOfTopLeftFromBoundingBox.y };
      
      const rotatedTouchedPoint = rotate(unrotatedCenter.x, unrotatedCenter.y, touchedPointOffsetFromTopLeft.x, touchedPointOffsetFromTopLeft.y, cardRotation);
     
      const delta = { x: unrotatedCenter.x - rotatedTouchedPoint.x, y: unrotatedCenter.y - rotatedTouchedPoint.y };

      setTouched({ x: event.pageX - boundingBoxLeft - offsetOfTopLeftFromBoundingBox.x, y: event.pageY - boundingBoxTop - offsetOfTopLeftFromBoundingBox.y});
      //setTouched({ x: rotatedCenter.x,y: rotatedCenter.y });
      console.log( delta);
    }
    setHover("longHover");
  };

  const hoverStyles = {
    longHover: {
      // transform: `scale(2) translateX(${inspectingCenterOffset.x}px) translateY(${inspectingCenterOffset.y}px)`,
      transform: `scale(1.1) rotate(${10 * index - rotation}deg)`,
      transition: "transform 800ms",
      zIndex: tableCardzIndex + 1,
      //  left: 125 * (index - (numHandCards / 2 - 0.5)),
    },
    shortHover: {
      transform: `scale(1.1) rotate(${10 * index - rotation}deg)`,
      transition: "transform 300ms, left 180ms, width 180ms",
      zIndex: tableCardzIndex + 1,
    },
    none: {},
  };
  let transitionStyles: TransitionStyles = { entering: {}, entered: {} };

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
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    //left: - 100 * (index - (numHandCards / 2 - 0.5)),
    top: index * cardTopSpread,
    position: "relative",
    transform: `rotate(${10 * index - rotation}deg)`,
    transition: `left 250ms, width 180ms, transform 180ms`,
  };

  if (transitionData) {
    const { origin, duration, curve } = transitionData;
    transitionStyles = {
      entering: {
        transform: `translateY(${origin.top}px) translateX(${origin.left}px)`,
        height: origin.height,
        width: origin.width,
      },
      entered: {
        transition: `transform ${duration}ms ${curve}, height ${duration}ms ${curve}, width ${duration}ms ${curve}`,
        zIndex: draggedCardzIndex,
      },
    };
  }

  const droppingStyles = (snapshot: DraggableStateSnapshot, style: DraggableProvidedDraggableProps) => {
    if (!snapshot.isDropAnimating || !isDraggedOverAnyPlace) {
      return style;
    }
    if (snapshot.dropAnimation) {
      const { curve, duration, moveTo } = snapshot.dropAnimation;
      let x = moveTo.x;
      let y = moveTo.y;
      console.log(moveTo);
      if (highlightType === "guestCard") {
        if (draggedHandCard && draggedHandCard.cardType === "bff") {
          x = BFFDraggedOverSide === "left" ? -60 : 40;
        } else x = -15;
        y = 60;
      } else if (draggedHandCard && draggedHandCard.cardType === "special") {
        x = -15;
        y = -25;
      } else {
        x = cardWidth - 175;
        y = cardHeight - 195;
      }

      const translate = `translate(${x}px, ${y}px)`;
      const scale = `scale(${dimensions.handToTableScaleFactor})`;
      return {
        ...style,
        transform: `${translate} ${scale}`,
        transition: `all ${curve} ${duration + 0.5}s`,
      };
    }
  };

  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            // The width of this element determines how far cards
            // move aside and make room in other droppables.
            // When not dragging it has a width of 0, which
            // tucks hand cards together
            style={{ width: isDragging ? dimensions.tableCardWidth : 0, position: "relative" }}
          >
            <Transition
              in={true}
              timeout={transitionData != null ? transitionData.wait : 0}
              appear={true}
              addEndListener={(node: HTMLElement) => {
                node.addEventListener(
                  "transitionend",
                  () => {
                    // removeCardTransition(id);
                  },
                  false
                );
              }}
            >
              {state => {
                return (
              
                  
                    <img
                      alt={image}
                      src={`./images/${image}.jpg`}
                      ref={cardRef}
                      onClick={handleClick}
                      onMouseEnter={setHoverStyles}
                      onMouseLeave={clearHoverStyles}
                      id={id}
                      style={{
                        ...normalStyles,
                        ...hoverStyles[hover],
                        ...transitionStyles[state],
                        ...dragStyles(isDragging),
                        ...droppingStyles(snapshot, provided.draggableProps),
                      }}
                    />
                   
                );
              }}
            </Transition>
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default HandCard;
