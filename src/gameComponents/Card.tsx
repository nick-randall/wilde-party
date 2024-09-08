import React, { CSSProperties, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import GhostCard from "./GhostCard";
import { CardInspector } from "../renderPropsComponents/CardInspector";
import TransitionHandler from "../renderPropsComponents/TransitionHandler";
import { RootState } from "../redux/store";
import { getSettings } from "../gameSettings/uiSettings";

export interface CardProps {
  id: number;
  index: number;
  imageName: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
  showNotAmongHighlights?: boolean;
}

const Card = (props: CardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, imageName } = props;
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

  const { highlights, highlightType, BFFdraggedOverSide, draggedHandCard } = useSelector((state: RootState) => state.dragEventState);
  const droppableId = JSON.stringify({ id, type: "card" });
  const draggedOver = useSelector((state: RootState) => state.dragEventState.draggedOver?.id === id);

  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  const BFFOffset = !BFFdraggedOverSide ? 0 : BFFdraggedOverSide === "left" ? -0.5 : 0.5;
  const notAmongHighlights = (highlightType === "card" && !highlights.includes(id)) || props.showNotAmongHighlights;

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft ? +offsetLeft + messinessOffset.x : messinessOffset.x,
    top: offsetTop ? offsetTop + messinessOffset.y : messinessOffset.y,
    position: "absolute",
    transform: `rotate(${messinessRotation}deg)`,
    transition: "300ms",
    // transitionDelay: "150ms",
    userSelect: "none",
  };

  return (
    <div>
      {/** // Here we use a droppable in an idomatic way, in order to allow
          // dropping on individual cards for the "enchant" action. Of course
          // no elements can actually be added to the droppable, but it allows
          // us to use the API (eg. isDraggingOver, droppableId--which is now
          // the targeted card) just the same... */}
      <Droppable droppableId={droppableId} isDropDisabled={!highlights.includes(id)}>
        {provided => (
          <div style={{ position: "absolute" }}>
            <CardInspector
              dimensions={dimensions}
              cardRotation={messinessRotation}
              render={(cardRef, handleClick, handleMouseLeave, inspectingStyles) => (
                <TransitionHandler
                  index={index}
                  id={id}
                  render={(transitionStyles: CSSProperties) => (
                    <div ref={cardRef}>
                      <img
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        alt={imageName}
                        draggable="false"
                        src={`./images/${imageName}.jpg`}
                        onClick={handleClick}
                        onMouseLeave={handleMouseLeave}
                        // id={id}
                        style={{
                          WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                          boxShadow: "2px 2px 2px black",
                          transition: "box-shadow 180ms",
                          ...normalStyles,
                          ...inspectingStyles,
                          ...transitionStyles,
                        }}
                      />
                    </div>
                  )}
                />
              )}
            />
            {ghostCard ? (
              <GhostCard
                index={0}
                offsetLeft={cardLeftSpread * BFFOffset}
                offsetTop={cardHeight / 2}
                imageName={ghostCard.imageName}
                dimensions={dimensions}
                zIndex={5}
              />
            ) : null}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
export default Card;

//<div ref={provided.innerRef} {...provided.droppableProps} style={{ width: dimensions.cardWidth, height: dimensions.cardHeight }} >
