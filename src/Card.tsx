import React, { CSSProperties, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { getSettings } from "./gameSettings/uiSettings";
import GhostCard from "./GhostCard";
import { RootState } from "./redux/store";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
  showNotAmongHighlights?: boolean;
}

const Card = (props: CardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image } = props;
  const { tableCardzIndex, cardLeftSpread, cardHeight, cardWidth } = dimensions;
  const settings = getSettings();

  const [messinessRotation, setMessinessRotation] = useState(0);
  const [messinessOffset, setMessinessOffset] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const rndR = Math.random() - 0.5;
    setMessinessRotation(rndR * settings.messiness);
    const rndX = Math.random() - 0.5;
    const rndY = Math.random() - 0.5;
    setMessinessOffset({ x: rndX * settings.messiness, y: rndY * settings.messiness });
  }, [setMessinessRotation, setMessinessOffset, index, settings.messiness]);


  const highlights = useSelector((state: RootState) => state.highlights);
  const highlightTypeIsCard = useSelector((state: RootState) => state.highlightType === "guestCard");

  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);

  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  const BFFOffset = !BFFDraggedOverSide ? 0 : BFFDraggedOverSide === "left" ? -0.5 : 0.5;
  const notAmongHighlights = (highlightTypeIsCard && !highlights.includes(id)) || props.showNotAmongHighlights;

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft ? +offsetLeft + messinessOffset.x : messinessOffset.x,
    top: offsetTop ? offsetTop + messinessOffset.y : messinessOffset.y,
    position: "absolute",
    transform: `rotate(${messinessRotation}deg)`,
    transition: "300ms",
    transitionDelay: "150ms",
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
              <CardInspector
                dimensions={dimensions}
                cardRotation={messinessRotation}
                render={(cardRef, handleClick, handleMouseLeave, inspectingStyles) => (
                  <div ref={cardRef}>
                  <img
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    alt={image}
                    src={`./images/${image}.jpg`}
                    onClick = {handleClick}
                    onMouseLeave={handleMouseLeave}
                    id={id}
                    style={{
                      WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                      //border: highlights.includes(id) ? "thick blue dotted" : "",
                      //boxShadow: snapshot.isDraggingOver ? "0px 0px 20px 20px yellowgreen" : "",
                      transition: "box-shadow 180ms",
                      ...normalStyles,
                      ...inspectingStyles
                    }}
                  />
                  </div>
                )}
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
