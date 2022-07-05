import { CSSProperties, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import Dragger from "./dndcomponents/Dragger";
import { handleEmissaryFromData } from "./transitionFunctions/handleIncomingEmissaryData";
import { getAllDimensions } from "./helperFunctions/getAllDimensions";
import AnimationHandler from "./thunks/animationFunctions/AnimationHandler";
import useMockRender from "./mockRender/useMockRender";
import handleEndAnimation from "./animations/handleEndAnimation";

export interface HandCardProps {
  id: string;
  handId: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  spread: number;
}

const HandCard = (props: HandCardProps) => {
  const { id, index, image, handId, spread, numHandCards, dimensions } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, cardHeight } = dimensions;
  // const isDragging = useSelector((state: RootState) => state.draggedHandCard !== undefined && state.draggedHandCard.id === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const isDraggedOverAnyPlace = useSelector((state: RootState) => state.dragUpdate.droppableId !== "");

  const highlightType = useSelector((state: RootState) => state.highlightType);
  const transitionUnderway = useSelector((state: RootState) => state.transitionData.length > 0);

  const { player, phase } = useSelector((state: RootState) => state.gameSnapshot.current);

  const canPlay = player === 0 && phase === "playPhase" && !transitionUnderway;

  const [shortHover, setShortHover] = useState(false);

  const mainStyles = (draggedOrDropping: boolean, rear?: boolean): CSSProperties =>
    !draggedOrDropping
      ? {
          // should be in dimensions
          zIndex: shortHover ? 30 : tableCardzIndex,
          position: "absolute",
          transform: `rotate(${rotation(index)}deg) scale(${shortHover ? 1.1 : 1})`,
          transition: `left 250ms, top 250ms, width 180ms, transform 180ms`,
          // transition: "300ms",
          width: cardWidth,
          pointerEvents: "auto",
          boxShadow: "10px 10px 10px black",
        }
      : {
          position: "absolute",
          transform: "",
          transition: "300ms",
          width: dimensions.tableCardWidth,
          zIndex: 10,
        };
  const endShortAndLongHover = (handleMouseLeave: Function) => {
    handleMouseLeave();
    setShortHover(false);
  };

  const emissaryRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  useMockRender(id, dimensions, rotation(index), emissaryRef);

  return (
    <Dragger draggerId={id} index={index} key={id} isDragDisabled={!canPlay} containerId={handId} isOutsideContainer>
      {draggerProps => (
        <AnimationHandler cardId={id} frontImgSrc={`./images/${image}.jpg`} backImgSrc={`./images/back.jpg`}>
          {animationProvidedProps => (
            <div
              // This div manages the spread (left positioning) for the Hand card.
              ref={draggerProps.ref}
              style={{
                position: "absolute",
                left: draggerProps.dragged || draggerProps.dropping ? "" : spread * index - (spread * numHandCards) / 2,
                top: 0,
                transition: "300ms",
              }}
            >
              <div ref={draggerProps.unrotatedElementRef} />
              <img
                ref={emissaryRef}
                alt={image}
                src={`./images/${image}.jpg`}
                draggable="false"
                onMouseDown={draggerProps.handleDragStart}
                onMouseEnter={() => setShortHover(true)}
                id={id}
                style={{
                  ...mainStyles(draggerProps.dragged || draggerProps.dropping),
                }}
                onAnimationEnd={() => dispatch(handleEndAnimation(id))}
                className={animationProvidedProps.className}
              />
            </div>
          )}
        </AnimationHandler>
      )}
    </Dragger>
  );
};
export default HandCard;
