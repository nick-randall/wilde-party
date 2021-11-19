import React, { CSSProperties, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Transition } from "react-transition-group";
import FeaturedCardTool from "./FeaturedCardTool";
import { getCardDimensions2 } from "./helperFunctions/getDimensions";
import useHoverStyles from "./hooks/useCardInspector";
import { RootState } from "./redux/store";

export interface HandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: CardDimensions;
  numHandCards: number;
  
  spread: number;
  offsetLeft?: number;
  offsetTop?: number;
  transitionData: TransitionData | undefined;
}

interface TransitionStyles {
  [status: string]: {};
}

const HandCard = (props: HandCardProps) => {
  const { id, index, image, transitionData, dimensions } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, draggedCardzIndex } = dimensions;
  const cardRef = useRef<HTMLImageElement>(null);

  //const dispatch = useDispatch();

  //const onDragStart = (clickEvent: React.MouseEvent) => props.onDragStart(card, cardRef, cardWidth, rotation);
  //dispatch({ type: "SET_DRAGGED_CARD", payload: card });
  const { setMousePosition, setHoverStyles, clearHoverStyles, hover, inspectingCenterOffset } = useHoverStyles(dimensions);

  const handleMouseMove = (event: React.MouseEvent) => {
    const element = cardRef.current;
    if (element) {
      const { left: boundingBoxLeft, top: boundingBoxTop } = element.getBoundingClientRect();
      setMousePosition(event, boundingBoxLeft, boundingBoxTop);
    }
  };

  const hoverStyles = {
    longHover: {
      transform: `scale(1.1) translateX(${inspectingCenterOffset.x}px) translateY(${inspectingCenterOffset.y}px)`,
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

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    //left: - 100 * (index - (numHandCards / 2 - 0.5)),
    top: index * cardTopSpread,
    position: "absolute",
    transform: `rotate(${10 * index - rotation}deg)`,
    transition: `left 250ms, width 180ms, transform 180ms`,
  };

  const dragStyles = (isDragging: boolean): CSSProperties =>
    isDragging ? { transform: `rotate(0deg)`
    , 
    //left: 125 * (index - (numHandCards / 2 - 0.5)) 
  } : {};

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
  const dragged = useSelector((state: RootState) => state.draggedHandCard === id);
  if(dragged)console.log("i am dragged");
  
  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided, snapshot) => (
        
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
          <div 
          // This width causes cards to move aside and make room in other droppables.
          // When not dragging it tucks cards together
          style={{width: dragged ? cardWidth : 0, ...dragStyles(snapshot.isDragging)}} >
            <FeaturedCardTool dimensions={dimensions} render={()=><div />}/> 
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
                    ...dragStyles(snapshot.isDragging),
                    
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
