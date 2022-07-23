import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getSettings } from "./gameSettings/uiSettings";
import { Transition, TransitionStatus } from "react-transition-group";
import { Droppable } from "react-beautiful-dnd";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import GhostCard from "./GhostCard";
import React from "react";
import AnimationHandler from "./animations/AnimationHandler";

export interface EnemyCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  offsetLeft?: number;
  offsetTop?: number;
  //transitionData: TransitionData | undefined;
  showNotAmongHighlights?: boolean;
}

const EnemyCard = (props: EnemyCardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image } = props;
  const { tableCardzIndex, cardLeftSpread, cardHeight, cardWidth } = dimensions;
  const highlights = useSelector((state: RootState) => state.highlights);
  const highlightTypeIsCard = useSelector((state: RootState) => state.highlightType === "card");

  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const notAmongHighlights = (highlightTypeIsCard && !highlights.includes(id)) || props.showNotAmongHighlights;
  const transitionData = useSelector((state: RootState) => state.transitionData.find(t => t.cardId === id));
  console.log("transitionData");
  const dispatch = useDispatch();
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

  const BFFOffset = !BFFDraggedOverSide ? 0 : BFFDraggedOverSide === "left" ? -0.5 : 0.5;
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
    <AnimationHandler backImgSrc={"./images/back.jpg"} frontImgSrc={"./images/back.jpg"} cardId={id}>
      {animationProvidedProps => (
        <img
          alt={image}
          draggable="false"
          src={`./images/${image}.jpg`}
          id={id}
          style={{
            WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
            boxShadow: "2px 2px 2px black",
            transition: "box-shadow 180ms",
            ...normalStyles,
          }}
          className={animationProvidedProps.className}
        />
      )}
    </AnimationHandler>
  );
};

export default EnemyCard;
