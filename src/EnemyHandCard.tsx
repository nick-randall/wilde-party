import { CSSProperties, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./animations/animations.css";
import locatePlayer from "./helperFunctions/locateFunctions/locatePlayer";
import { handleEmissaryFromData } from "./redux/handleIncomingEmissaryData";
import { RootState } from "./redux/store";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";

export interface EnemyHandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
}

const EnemyHandCard = (props: EnemyHandCardProps) => {
  const { id, index, image, dimensions } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, cardHeight, cardLeftSpread } = dimensions;


  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,

    //left: - 100 * (index - (numHandCards / 2 - 0.5)),
    top:  cardTopSpread,
    left: index * cardLeftSpread,
    position: "absolute",
    transform: `rotate(${rotation(index)}deg)`,
    transition: `left 250ms, width 180ms, transform 180ms, opacity 300ms`,
    pointerEvents: "auto",
    boxShadow: "10px 10px 10px black",
  };
  const cardPlayer = locatePlayer(id);
  const ownerIsCurrentPlayer = useSelector((state: RootState) => state.gameSnapshot.current.player === cardPlayer);
  const currentPhaseIsDeal = useSelector((state: RootState) => state.gameSnapshot.current.phase === "dealPhase");
  const disappearingStyles = ownerIsCurrentPlayer || currentPhaseIsDeal ? {
    opacity : 1
  } :{ opacity:0}

  const newSnapshots = useSelector((state: RootState) => state.newSnapshots);
  const emissaryRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (newSnapshots.length === 0) return;
    newSnapshots[0].transitionTemplates.forEach(template => {
      if (template.from.cardId === id && template.status === "awaitingEmissaryData") {
        if (emissaryRef !== null && emissaryRef.current !== null) {
          const element = emissaryRef.current;
          const { left, top } = element.getBoundingClientRect();
          console.log("handCardEmissaryData---left: " + left, " ---top: " + top);

          dispatch(handleEmissaryFromData({ cardId: id, xPosition: left, yPosition: top, dimensions: dimensions }));
        }
      }
    });
  }, [dimensions, dispatch, id, newSnapshots]);

  return (
   
      <TransitionHandler
        index={index}
        id={id}
        render={(transitionStyles: CSSProperties) => (
          <img
           ref={emissaryRef}
            alt={image}
             src={"./images/back.jpg"}
            // src={`./images/${image}.jpg`}
            draggable = "false"

            id={id}
            style={{
              ...normalStyles,
              ...transitionStyles,
              // ...disappearingStyles
            }}
          />
        )}
      />

  );
};
export default EnemyHandCard;
