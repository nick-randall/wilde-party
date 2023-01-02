import { CSSProperties, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Dragger from "../dndcomponents/Dragger";
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
  const transitionUnderway = useSelector((state: RootState) => state.animationData.length > 0);

  const { player, phase } = useSelector((state: RootState) => state.gameSnapshot.current);

  const canPlay = player === 0 && phase === "playPhase" && !transitionUnderway;

  const [shortHover, setShortHover] = useState(false);

  const mainStyles = (draggedOrDropping: string): CSSProperties =>
    draggedOrDropping === "dragged"
      ? {
          width: cardWidth,
          height: cardHeight,

          transition: "300ms",
          pointerEvents: "none",
          zIndex: 10,
          boxShadow: "10px 10px 10px black",

        }
      : draggedOrDropping === "dropping"
      ? {
          // should be in dimensions
          zIndex: shortHover ? 30 : tableCardzIndex,
          transition: `left 250ms, top 250ms, width 180ms, transform 180ms`,

          width: dimensions.tableCardWidth,
          height: dimensions.tableCardHeight,
          pointerEvents: "none",
          boxShadow: "10px 10px 10px black",
        }
      : {
          width: cardWidth,
          height: cardHeight,
          transition: "300ms",
          pointerEvents: canPlay ? "auto" : "none",
          zIndex: 10,
          boxShadow: "10px 10px 10px black",

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

            transition: `left 180ms`,
          }}
        >
          <CardBase
            id={id}
            image={image}
            // offsetLeft={spread * index - (spread * numHandCards) / 2}
            extraStyles={{ ...mainStyles(draggerProps.dragged ? "dragged" : draggerProps.dropping ? "dropping" : "") }}
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
