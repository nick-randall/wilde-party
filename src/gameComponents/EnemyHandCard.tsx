import { CSSProperties, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationHandler from "../animations/AnimationHandler";
import handleEndAnimation from "../animations/handleEndAnimation";
import { rotateHandCard } from "../helperFunctions/getDimensions";
import locatePlayer from "../helperFunctions/locateFunctions/locatePlayer";
import useMockRender from "../mockRender/useMockRender";
import { RootState } from "../redux/store";
import CardBase from "./CardBase";
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

  useMockRender(id, dimensions, rotateHandCard(index, numHandCards), mockRenderRef);

  return (
          <CardBase
            id={id}
            image={image}
            offsetLeft={spread * index - (spread * numHandCards) / 2}
            dimensions={dimensions}
            rotateX={rotateHandCard(index, numHandCards)}
            ref={mockRenderRef}
          />
  );
};
export default EnemyHandCard;
