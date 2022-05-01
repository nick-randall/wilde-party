import { CSSProperties, useEffect, useRef, useState } from "react";
import { Draggable, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";
import Dragger from "./dndcomponents/Dragger";
import { handleEmissaryFromData } from "./redux/handleIncomingEmissaryData";

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
  const { id, index, image, dimensions, handId, spread, numHandCards } = props;

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

  const dragStyles = (isDragging: boolean | undefined): CSSProperties =>
    isDragging
      ? {
          left: "",
          transform: `rotate(0deg)`,
          pointerEvents: "none",
          // This width causes cards to move aside and make room in other droppables.
          // When not dragging it tucks cards together

          // height: 168,
          // width: 105,
          //left: 125 * (index - (numHandCards / 2 - 0.5))
        }
      : {};
  const normalStyles: CSSProperties = {
    // should be in dimensions
    zIndex: shortHover ? 30 : tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    top: index * cardTopSpread,
    left: spread * index - (spread * numHandCards) / 2,
    position: "absolute",
    transform: `rotate(${rotation(index)}deg) scale(${shortHover ? 1.1 : 1})`,
    transition: `left 250ms, width 180ms, transform 180ms`,
    pointerEvents: "auto",
    boxShadow: "10px 10px 10px black",
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
        console.group("AWAITING")
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
      {draggerRenderProps => (
        //  <div style= {{left: spread * index - (spread * numHandCards) / 2, position:"absolute"}}>
        <CardInspector
          dimensions={dimensions}
          cardRotation={10 * index - rotation(index)}
          render={(cardRef, handleClick, handleMouseLeave, inspectedStyles) => (
            <TransitionHandler
              index={index}
              id={id}
              render={(transitionStyles: CSSProperties) => (
                <div ref={emissaryRef} style={{ position: "relative" }}>
                  <img
                    alt={image}
                    src={`./images/${image}.jpg`}
                    draggable="false"
                    ref={draggerRenderProps.draggerRef}
                    onClick={handleClick}
                    onMouseDown={draggerRenderProps.handleDragStart}
                    onMouseEnter={() => setShortHover(true)}
                    onMouseLeave={() => endShortAndLongHover(handleMouseLeave)}
                    id={id}
                    style={{
                      ...normalStyles,
                      ...inspectedStyles,
                      ...dragStyles(draggerRenderProps.isDragging),
                      ...transitionStyles,
                      // ...droppingStyles(snapshot, provided.draggableProps),
                    }}
                  />
                </div>
              )}
            />
          )}
        />
      )}
    </Dragger>
  );
};
export default HandCard;
