import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getSettings } from "../gameSettings/uiSettings";
import { Droppable } from "react-beautiful-dnd";
import { CardInspector } from "../renderPropsComponents/CardInspector";
import TransitionHandler from "../renderPropsComponents/TransitionHandler";
import GhostCard from "./GhostCard";
import React from "react";
import { getCardStyleValues } from "../helperFunctions/getCardStyles";
import { get } from "http";

export interface EnemyCardProps {
  id: number;
  index: number;
  imageName: string;
  numHandCards: number;
  offsetLeft?: number;
  offsetTop?: number;
  //transitionData: TransitionData | undefined;
  showNotAmongHighlights?: boolean;
}

const EnemyCard = (props: EnemyCardProps) => {
  const { id, index, offsetTop, offsetLeft, imageName } = props;
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const { zIndex: tableCardzIndex, left: cardLeftSpread, cardHeight, cardWidth } = getCardStyleValues(id, currSnapshot);
  const { highlights, BFFdraggedOverSide, draggedOver, draggedHandCard } = useSelector((state: RootState) => state.dragEventState);
  const highlightTypeIsCard = useSelector((state: RootState) => state.dragEventState.highlightType === "card");
  const droppableId = JSON.stringify({ id, type: "card" });
  const isDraggedOver = useSelector((state: RootState) => draggedOver?.id === id);
  const notAmongHighlights = (highlightTypeIsCard && !highlights.includes(id)) || props.showNotAmongHighlights;
  const transitionData = useSelector((state: RootState) => state.dragEventState.transitionData.find(t => t.cardId === id));
  console.log("transitionData");
  interface TransitionStyles {
    [status: string]: {};
  }

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

  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  const BFFOffset = !BFFdraggedOverSide ? 0 : BFFdraggedOverSide === "left" ? -0.5 : 0.5;
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
    <Droppable droppableId={droppableId} isDropDisabled={!highlights.includes(id)}>
      {
        // Here we use a droppable in an idomatic way, in order to allow
        // dropping on individual cards for the "enchant" action. Of course
        // no elements can actually be added to the droppable, but it allows
        // us to use the API (eg. isDraggingOver, droppableId--which is now
        // the targeted card) just the same...
        provided => (
          <div style={{ position: "relative" }}>
            <CardInspector
              dimensions={getCardStyleValues(id, currSnapshot)}
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
                cardId={ghostCard.id}
                index={0}
                offsetLeft={cardLeftSpread * BFFOffset}
                offsetTop={cardHeight / 2}
                imageName={ghostCard.imageName}
                zIndex={5}
              />
            ) : null}
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  );
};

export default EnemyCard;
