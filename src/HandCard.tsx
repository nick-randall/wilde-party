import React, { CSSProperties, useRef, useState } from "react";
import { Draggable, DraggableProps, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Transition } from "react-transition-group";
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

  const { setMousePosition, setHoverStyles, clearHoverStyles, hover, inspectingCenterOffset } = useHoverStyles(dimensions);
  const isDragging = useSelector((state: RootState) => state.draggedHandCard !== undefined && state.draggedHandCard.id === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide === "left" ? 0 : 1)

  const highlightType = useSelector((state: RootState) => state.highlightType);

  const handleMouseMove = (event: React.MouseEvent) => {
    const element = cardRef.current;
    if (element) {
      const { left: boundingBoxLeft, top: boundingBoxTop, bottom: boundingBoxBottom } = element.getBoundingClientRect();
      setMousePosition(event, boundingBoxLeft, boundingBoxTop, boundingBoxBottom);
    }
  };

  const hoverStyles = {
    longHover: {
      transform: `scale(2) translateX(${inspectingCenterOffset.x}px) translateY(${inspectingCenterOffset.y}px)`,
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
    //left: - 100 * (index - (numHandCards / 2 - 0.5)),
    top: index * cardTopSpread,
    position: "absolute",
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

  const droppingStyles = (snapshot: DraggableStateSnapshot, style: DraggableProvidedDraggableProps): CSSProperties =>
    snapshot.isDropAnimating && snapshot.dropAnimation
      ? { height: cardHeight / 2, transition: "9 s" /* transform: `translateY(${snapshot.dropAnimation?.moveTo.y -200}px)`*/ }
      : {};

  function getStyle(snapshot: DraggableStateSnapshot, style: DraggableProvidedDraggableProps) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    if (snapshot.dropAnimation) {
      const { moveTo, curve, duration } = snapshot.dropAnimation;
      // move to the right spot
      // const translate = `translate(${moveTo.x + 10}px, ${moveTo.y + 310}px)`;

      const translate = ""; //`translate(${moveTo.x}px, ${moveTo.y}px)`;
      const scale = `scale(${dimensions.handToTableScaleFactor})`;
      // add a bit of turn for fun
      const rotate = "";

      // patching the existing style
      return {
        ...style,
        transform: `${translate} ${rotate} ${scale}`,
        top: highlightType === "guestCard" ? 60 : -25,
        left: highlightType === "guestCard" ? (draggedHandCard && draggedHandCard.cardType === "bff" ? 35 * BFFDraggedOverSide : -35) : -75,
        // slowing down the drop because we can
        // transition: `all ${curve} ${duration + 1}s`,
      };
    }
  }

  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            // The width of this element determines how far cards
            // move aside and make room in other droppables.
            // When not dragging it has a width of 0, which
            // tucks hand cards together
            style={{ width: isDragging ? 105 : 0, position: "relative" }}
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
                    onMouseMove={handleMouseMove}
                    onMouseEnter={setHoverStyles}
                    onMouseLeave={clearHoverStyles}
                    id={id}
                    style={{
                      ...normalStyles,
                      ...hoverStyles[hover],
                      ...transitionStyles[state],
                      ...dragStyles(isDragging),
                      ...getStyle(snapshot, provided.draggableProps),
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
