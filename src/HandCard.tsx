import { CSSProperties, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";
import Dragger from "./dndcomponents/Dragger";
import { handleEmissaryFromData } from "./transitionFunctions/handleIncomingEmissaryData";
import { getAllDimensions } from "./helperFunctions/getAllDimensions";

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
  console.log(rotation)
  console.log(index)
  console.log(rotation(index))

  const mainStyles = (draggedOrDropping: boolean): CSSProperties =>
    !draggedOrDropping
      ? {
          // should be in dimensions
          zIndex: shortHover ? 30 : tableCardzIndex,
          position: "absolute",
          transform: `rotate(${rotation(index)}deg) scale(${shortHover ? 1.1 : 1})`,
          // transition: `left 250ms, width 180ms, transform 180ms`,
          transition: "300ms",
          width: cardWidth,
          pointerEvents: "auto",
          boxShadow: "10px 10px 10px black",
        }
      : {
          position: "absolute",
          transform: "",
          transition: "300ms",
          width: dimensions.tableCardWidth,
          // zIndex: draggerProps.dragged ? 10 : 0,
        };
  const endShortAndLongHover = (handleMouseLeave: Function) => {
    handleMouseLeave();
    setShortHover(false);
  };

  const newSnapshots = useSelector((state: RootState) => state.newSnapshots);
  const emissaryRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (newSnapshots.length === 0) return;
    newSnapshots[0].transitionTemplates.forEach(template => {
      if (template.from.cardId === id && template.status === "awaitingEmissaryData") {
        console.log("AWAITING");
        if (emissaryRef !== null && emissaryRef.current !== null) {
          const element = emissaryRef.current;
          const { left, top } = element.getBoundingClientRect();
          console.log("handCardEmissary FromData---left: " + left, " ---top: " + top);

          dispatch(handleEmissaryFromData({ cardId: id, xPosition: left, yPosition: top, dimensions: dimensions }));
        }
      }
    });
  }, [dimensions, dispatch, id, index, newSnapshots, rotation]);

  return (
    <Dragger draggerId={id} index={index} key={id} isDragDisabled={!canPlay} containerId={handId} isOutsideContainer>
      {draggerProps => (
        <TransitionHandler
          index={index}
          id={id}
          render={(transitionStyles: CSSProperties) => (
            <div
              // This div manages the spread (left positioning) for the Hand card.
              ref={draggerProps.ref}
              style={{
                position: "absolute",
                left: draggerProps.dragged || draggerProps.dropping ? "" : spread * index - (spread * numHandCards) / 2,
                transition: "300ms",
                ...transitionStyles,
              }}
            >
              <CardInspector
                dimensions={dimensions}
                cardRotation={10 * index - rotation(index)}
                render={(cardRef, handleClick, handleMouseLeave, inspectedStyles) => (
                  <div ref={emissaryRef}>
                    <div ref={draggerProps.unrotatedElementRef} />
                    <img
                      alt={image}
                      src={`./images/${image}.jpg`}
                      draggable="false"
                      onClick={handleClick}
                      onMouseDown={draggerProps.handleDragStart}
                      onMouseEnter={() => setShortHover(true)}
                      onMouseLeave={() => endShortAndLongHover(handleMouseLeave)}
                      id={id}
                      style={{
                        ...mainStyles(draggerProps.dragged || draggerProps.dropping),
                        ...transitionStyles,
                      }}
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      )}
    </Dragger>
  );
};
export default HandCard;
