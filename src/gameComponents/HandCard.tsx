import { CSSProperties, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
// import "./animations/animations.css";
import { CardInspector } from "../renderPropsComponents/CardInspector";
import Dragger from "../dndcomponents/Dragger";
import AnimationHandler from "../animations/AnimationHandler";
import useMockRender from "../mockRender/useMockRender";
import handleEndAnimation from "../animations/handleEndAnimation";
import { rotateHandCard } from "../helperFunctions/getDimensions";
import CardBase from "./CardBase";

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

  const { tableCardzIndex, cardWidth, rotateY, cardTopSpread, cardHeight } = dimensions;
  // const isDragging = useSelector((state: RootState) => state.draggedHandCard !== undefined && state.draggedHandCard.id === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);

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
          transition: `left 250ms, top 250ms, width 180ms, transform 180ms`,
          width: cardWidth,
          pointerEvents: "auto",
          boxShadow: "10px 10px 10px black",
        }
      : {
          transition: "300ms",
          width: dimensions.tableCardWidth,
          height: dimensions.tableCardHeight,
          pointerEvents: "none",
          zIndex: 10,
        };
  const endShortAndLongHover = (handleMouseLeave: Function) => {
    handleMouseLeave();
    setShortHover(false);
  };

  const mockRenderRef = useRef<HTMLImageElement>(null);

  return (
    <Dragger draggerId={id} index={index} key={id} isDragDisabled={!canPlay} containerId={handId} isOutsideContainer>
      {draggerProps => (
        <div
          onMouseDown={draggerProps.handleDragStart}
          onMouseEnter={() => setShortHover(true)}
          // This div manages the spread (left positioning) for the Hand card.
          ref={draggerProps.ref}
          style={{
            position: "absolute",
            left: draggerProps.dragged || draggerProps.dropping ? "" : spread * index - (spread * numHandCards) / 2,
            // top: 0,
            // pointerEvents: "none",

            transition: "300ms",
          }}
        >
          <CardBase
            id={id}
            image={image}
            // offsetLeft={spread * index - (spread * numHandCards) / 2}
            extraStyles={{...mainStyles(draggerProps.dragged || draggerProps.dropping)}}
            dimensions={dimensions}
            rotateX={draggerProps.dragged || draggerProps.dropping ? 0 : rotateHandCard(index, numHandCards)}
            ref={mockRenderRef}
          />
          <div ref={draggerProps.unrotatedElementRef} />

        </div>
      )}
    </Dragger>
  );
};
export default HandCard;
