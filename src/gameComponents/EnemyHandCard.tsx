import { CSSProperties, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationHandler from "../animations/AnimationHandler";
import handleEndAnimation from "../animations/handleEndAnimation";
import { rotateHandCard } from "../helperFunctions/getDimensions";
import locatePlayer from "../helperFunctions/locateFunctions/locatePlayer";
import useMockRender from "../mockRender/useMockRender";
import { RootState } from "../redux/store";
// import "./animations/animations.css";

export interface EnemyHandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  spread: number;
}

const EnemyHandCard = (props: EnemyHandCardProps) => {
  const { id, index, image, dimensions, numHandCards, spread } = props;

  const { zIndex, cardWidth, facing, cardTopSpread, cardHeight, cardLeftSpread } = dimensions;

  const normalStyles: CSSProperties = {
    zIndex: zIndex,
    width: cardWidth,
    // top: cardTopSpread,
    left: spread * index - (spread * numHandCards) / 2,
    position: "absolute",
    transform: `rotate(${rotateHandCard(index, numHandCards)}deg) rotate3d(0, 1, 0, ${facing === "front" ? 0 : 180})`,
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

  const mockRenderRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();
  useMockRender(id, dimensions, rotateHandCard(index, numHandCards), mockRenderRef);

  return (
    <AnimationHandler backImgSrc={"./images/back.jpg"} frontImgSrc={`./images/${image}.jpg`} cardId={id}>
      {animationProvidedProps => (
        <div ref={mockRenderRef}>
          <img
            alt={image}
            src={facing === "front" ? `./images/${image}.jpg` : `./images/back.jpg`}
            draggable="false"
            id={id}
            style={{
              ...normalStyles,
            }}
            onAnimationEnd={() => dispatch(handleEndAnimation(id))}
            className={animationProvidedProps.className}
          />
        </div>
      )}
    </AnimationHandler>
  );
};
export default EnemyHandCard;
