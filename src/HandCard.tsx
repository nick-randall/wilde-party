import React, { CSSProperties, useRef, useState } from "react";
import { Draggable, DraggableProps, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Transition, TransitionStatus } from "react-transition-group";
import { rotate } from "./helperFunctions/equations";
import useHoverStyles from "./hooks/useCardInspector";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { relative } from "path";
import { CardInspector } from "./CardInspector";

export interface HandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  offsetLeft?: number;
  offsetTop?: number;
}

interface TransitionStyles {
  [status: string]: {};
}

const HandCard = (props: HandCardProps) => {
  const { id, index, image, dimensions } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, draggedCardzIndex, cardHeight } = dimensions;
  const scale = 2;

  //const { setMousePosition, setHoverStyles, clearHoverStyles, hover, inspectingCenterOffset, setHover } = useHoverStyles(dimensions);
  const isDragging = useSelector((state: RootState) => state.draggedHandCard !== undefined && state.draggedHandCard.id === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const isDraggedOverAnyPlace = useSelector((state: RootState) => state.dragUpdate.droppableId !== "");

  const highlightType = useSelector((state: RootState) => state.highlightType);
  const transitionData = useSelector((state: RootState) => state.transitionData.find(t => t.cardId === id));

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
    left: 0,
    position: "absolute",
    transform: `rotate(${rotation(index)}deg)`,
    transition: `left 250ms, width 180ms, transform 180ms`,
    pointerEvents: "auto",
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
  const getTransition = (state: TransitionStatus, sideOfCard: string) => {
    if (transitionData) {
      const { originDelta, duration, curve, originDimensions, startAnimation, startAnimationDuration } = transitionData;

      if (state === "entering") {
        transitionStyles = {
          //transform: `translateX(${originDelta.x}px) translateY(${originDelta.y}px)`,
          left: originDelta.x,
          top: originDelta.y,
          transform: "",
          animationName: sideOfCard === "front" ? startAnimation : "back-of-card-" + startAnimation,
          animationDuration: `${startAnimationDuration + 20}ms`,
          height: originDimensions.cardHeight,
          width: originDimensions.cardWidth,
          pointerEvents: "none",
        };
      } else if (state === "entered") {
        transitionStyles = {
          transition: `transform ${duration}ms ${curve},  height ${duration}ms ${curve}, width ${duration}ms ${curve}, left ${duration}ms ${curve}, top ${duration}ms ${curve}`,
        };
        console.log("entered", transitionStyles);
      }

      return transitionStyles;
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
            <CardInspector
              dimensions={dimensions}
              cardRotation={10 * index - rotation(index)}
              render={(cardRef, handleClick, handleMouseLeave, inspectedStyles) => (
                <Transition
                  in={true}
                  timeout={transitionData !== undefined ? transitionData.startAnimationDuration : 0}
                  appear={true}
                  addEndListener={(node: HTMLElement) => {
                    node.addEventListener(
                      "transitionend",
                      () => {
                        //removeCardTransition();
                      },
                      false
                    );
                  }}
                >
                  {state => {
                    return (
                      <div style={{ display: "relative" }}>
                        <img
                          src="./images/back.jpg"
                          alt="deck"
                          style={{
                            ...normalStyles,
                            ...getTransition(state, "back"),
                          }}
                        />
                        <img
                          alt={image}
                          src={`./images/${image}.jpg`}
                          ref={cardRef}
                          onClick={handleClick}
                          onMouseLeave={handleMouseLeave}
                          id={id}
                          style={{
                            ...normalStyles,
                            ...inspectedStyles,
                            //...transitionStyles[state],
                            ...dragStyles(isDragging),
                            ...getTransition(state, "front"),
                            ...droppingStyles(snapshot, provided.draggableProps),
                          }}
                        />
                      </div>
                    );
                  }}
                </Transition>
              )}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default HandCard;
