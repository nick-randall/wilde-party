import React, { CSSProperties, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardInspector } from "../renderPropsComponents/CardInspector";
import { getSettings } from "../gameSettings/uiSettings";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";
import DropZoneWrapper from "../dndcomponents/DropZoneWrapper";
import AnimationHandler from "../animations/AnimationHandler";
import useMockRender from "../mockRender/useMockRender";
import handleEndAnimation from "../animations/handleEndAnimation";
import CardBase from "./CardBase";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
  placeId: string;
  placeType: PlaceType;
  showNotAmongHighlights?: boolean;
  isPlaceHolder?: boolean
}

const Card = (props: CardProps) => {
  const { id, placeId, index, dimensions, offsetTop, offsetLeft, image, placeType, isPlaceHolder } = props;
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

  const BFFOffset = !BFFDraggedOverSide ? 0 : BFFDraggedOverSide === "left" ? -0.5 : 0.5;
  const notAmongHighlights = (highlightTypeIsCard && !highlights.includes(id)) || props.showNotAmongHighlights;

  const mockRenderRef = useRef<HTMLImageElement>(null);
  useMockRender(id, dimensions, 0, mockRenderRef);
  if(isPlaceHolder) return <div style={{height: cardHeight, width: cardWidth}}/>
  return (
   
        <DropZoneWrapper id={placeId} providedIndex={index} insertToTheRight isDropDisabled>
          {isDraggingOver => (
            <>
              <CardBase
                ref={mockRenderRef}
                id={id}
                image={image}
                dimensions={dimensions}
                rotateX={0}
                greyedOut={notAmongHighlights}
                offsetLeft={offsetLeft}
                offsetTop={offsetTop}
                // className={animationProvidedProps.className}
              >
                {isDraggingOver && draggedHandCard ? (
                  <GhostCard
                    offsetLeft={cardLeftSpread * BFFOffset}
                    offsetTop={cardHeight / 2}
                    image={draggedHandCard.image}
                    dimensions={dimensions}
                    zIndex={5}
                  />
                ) : null}
              </CardBase>
            </>
          )}
        </DropZoneWrapper>
     
  );
};
export default Card;
