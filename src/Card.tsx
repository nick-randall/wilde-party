import React, { CSSProperties, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { getSettings } from "./gameSettings/uiSettings";
import GhostCard from "./GhostCard";
import useHoverStyles from "./hooks/useCardInspector";
import { RootState } from "./redux/store";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
}

const Card = (props: CardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image } = props;
  const { tableCardzIndex, cardLeftSpread, cardHeight, cardWidth } = dimensions;
  const { setMousePosition, setHoverStyles, clearHoverStyles, hover, inspectingCenterOffset } = useHoverStyles(dimensions);
  const settings = getSettings();
  const cardRef = useRef<HTMLImageElement>(null);

  const [rotation, setRotation] = useState(0);

  React.useEffect(() => {
    const rnd = Math.random() - 0.5;
    setRotation(rnd * settings.messiness);
  }, [setRotation, index, settings.messiness]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const element = cardRef.current;
    if (element) {
      const { left: boundingBoxLeft, top: boundingBoxTop, bottom: boundingBoxBottom } = element.getBoundingClientRect();
      setMousePosition(event, boundingBoxLeft, boundingBoxTop, boundingBoxBottom);
    }
  };
  const highlights = useSelector((state: RootState) => state.highlights);
  const highlightTypeIsCard = useSelector((state: RootState) => state.highlightType === "guestCard");

  const highlightType = useSelector((state: RootState) => state.highlightType);


  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);

  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  const BFFOffset = !BFFDraggedOverSide ? 0 : BFFDraggedOverSide === "left" ? -0.5 : 0.5;
  const notAmongHighlights = highlightTypeIsCard && !highlights.includes(id)

  //const ghostCard = BFFDraggedOverSide !== "" ? draggedOver

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft || "",
    top: offsetTop || "",
    position: "absolute",
    transform: `rotate(${rotation}deg)`,
    transition: "300ms",
    transitionDelay: "150ms"
  };

  const hoverStyles = {
    longHover: {
      transform: `scale(2) translateX(${inspectingCenterOffset.x}px) translateY(${inspectingCenterOffset.y}px)`,
      transition: "transform 800ms",
      zIndex: tableCardzIndex + 1,
      //  left: 125 * (index - (numHandCards / 2 - 0.5)),
    },
    shortHover: {},
    none: {},
  };


  return (
    <div>
      <Droppable droppableId={id} isDropDisabled={!highlights.includes(id)}>
        {
          // Here we use a droppable in an idomatic way, in order to allow
          // dropping on individual cards for the "enchant" action. Of course
          // no elements can actually be added to the droppable, but it allows
          // us to use the API (eg. isDraggingOver, droppableId--which is now
          // the targeted card) just the same...
          (provided, snapshot) => (
            <div style={{ position: "relative" }}>
              <img
                ref={provided.innerRef}
                {...provided.droppableProps}
                alt={image}
                src={`./images/${image}.jpg`}
                onMouseMove={handleMouseMove}
                onMouseEnter={setHoverStyles}
                onMouseLeave={clearHoverStyles}
                id={id}
                style={{
                  WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                  //border: highlights.includes(id) ? "thick blue dotted" : "",
                  //boxShadow: snapshot.isDraggingOver ? "0px 0px 20px 20px yellowgreen" : "",
                  transition: "box-shadow 180ms",
                  ...normalStyles,
                  ...hoverStyles[hover],
                }}
              />
              {ghostCard ? (
                <GhostCard
                  index={0}
                  offsetLeft={cardLeftSpread * BFFOffset}
                  offsetTop={cardHeight / 2}
                  image={ghostCard.image}
                  dimensions={dimensions}
                  zIndex={5}
                />
              ) : null}
              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
    </div>
  );
};
export default Card;

//<div ref={provided.innerRef} {...provided.droppableProps} style={{ width: dimensions.cardWidth, height: dimensions.cardHeight }} >
