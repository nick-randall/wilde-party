import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { getSettings } from "./gameSettings/uiSettings";
import GhostCard from "./GhostCard";
import { RootState } from "./redux/store";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";
import DropZoneWrapper from "./dndcomponents/DropZoneWrapper";
import { handleEmissaryFromData } from "./transitionFunctions/handleIncomingEmissaryData";
import AnimationHandler from "./thunks/animationFunctions/AnimationHandler";
import useMockRender from "./mockRender/useMockRender";
import handleEndAnimation from "./animations/handleEndAnimation";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
  placeId: string;
  showNotAmongHighlights?: boolean;
}

const Card = (props: CardProps) => {
  const { id, placeId, index, dimensions, offsetTop, offsetLeft, image } = props;
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
  const highlightTypeIsCard = useSelector((state: RootState) => state.highlightType === "card");

  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  // const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);

  // const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
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
    // transitionDelay: "150ms",
    userSelect: "none",
  };

  const emissaryRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const newSnapshots = useSelector((state: RootState) => state.newSnapshots);

  useEffect(() => {
    if (newSnapshots.length === 0) return;
    newSnapshots[0].animationTemplates.forEach(template => {
      if (template.from.cardId === id && template.status === "awaitingEmissaryData") {
        if (emissaryRef !== null && emissaryRef.current !== null) {
          const element = emissaryRef.current;
          const { left, top } = element.getBoundingClientRect();
          console.log("TableCardEmissaryData---cardId: " + id);
          dispatch(handleEmissaryFromData({ cardId: id, xPosition: left, yPosition: top, dimensions: dimensions }));
        }
      }
    });
  }, [dimensions, dispatch, id, newSnapshots]);

  useMockRender(id, dimensions, 0, emissaryRef);
  return (
    <div style={{ position: "absolute" }} ref={emissaryRef}>
      <CardInspector
        dimensions={dimensions}
        cardRotation={messinessRotation}
        render={(cardRef, handleClick, handleMouseLeave, inspectingStyles) => (
          <AnimationHandler cardId={id} frontImgSrc={`./images/${image}.jpg`} backImgSrc={`./images/back.jpg`}>
            {animationProvidedProps => (
              <div ref={cardRef}>
                <DropZoneWrapper id={placeId} providedIndex={index} insertToTheRight isDropDisabled>
                  {isDraggingOver => (
                    <div>
                      <img
                        alt={image}
                        draggable="false"
                        src={`./images/${image}.jpg`}
                        onClick={handleClick}
                        onMouseLeave={handleMouseLeave}
                        id={id}
                        style={{
                          WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                          boxShadow: "2px 2px 2px black",
                          transition: "box-shadow 180ms",
                          ...normalStyles,
                          ...inspectingStyles,
                        }}
                        onAnimationEnd={() => dispatch(handleEndAnimation(id))}
                        className={animationProvidedProps.className}
                      />
                      {isDraggingOver && draggedHandCard ? (
                        <GhostCard
                          offsetLeft={cardLeftSpread * BFFOffset}
                          offsetTop={cardHeight / 2}
                          image={draggedHandCard.image}
                          dimensions={dimensions}
                          zIndex={5}
                        />
                      ) : null}
                    </div>
                  )}
                </DropZoneWrapper>
              </div>
            )}
          </AnimationHandler>
        )}
      />
    </div>
  );
};
export default Card;
