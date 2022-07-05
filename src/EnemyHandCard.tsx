import { CSSProperties, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./animations/animations.css";
import locatePlayer from "./helperFunctions/locateFunctions/locatePlayer";
import { RootState } from "./redux/store";
import useMockRender from "./mockRender/useMockRender";
import AnimationHandler from "./thunks/animationFunctions/AnimationHandler";
import handleEndAnimation from "./animations/handleEndAnimation";

export interface EnemyHandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
}

const EnemyHandCard = (props: EnemyHandCardProps) => {
  const { id, index, image, dimensions } = props;

  const { zIndex, cardWidth, cardTopSpread, rotation, cardHeight, cardLeftSpread } = dimensions;

  const normalStyles: CSSProperties = {
    zIndex: zIndex,
    width: cardWidth,
    height: cardHeight,
    top: cardTopSpread,
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
  const disappearingStyles =
    ownerIsCurrentPlayer || currentPhaseIsDeal
      ? {
          opacity: 1,
        }
      : { opacity: 0 };

  const emissaryRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();
  useMockRender(id, dimensions, rotation(index), emissaryRef);


  return (
    <AnimationHandler backImgSrc={"./images/back.jpg"} frontImgSrc={`./images/${image}.jpg`} cardId={id}>
      {animationProvidedProps => (
        <img
          ref={emissaryRef}
          alt={image}
          src={`./images/back.jpg`}
          draggable="false"
          id={id}
          style={{
            ...normalStyles,
          }}
          onAnimationEnd={() => dispatch(handleEndAnimation(id))}
          className={animationProvidedProps.className}
        />
      )}
    </AnimationHandler>
  );
};
export default EnemyHandCard;
