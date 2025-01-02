import { CSSProperties } from "react";
import { useSelector } from "react-redux";
import locatePlayer from "../helperFunctions/locateFunctions/locatePlayer";
import { RootState } from "../redux/store";
import { getCardStyleValues } from "../helperFunctions/getCardStyles";

export interface EnemyHandCardProps {
  id: number;
  index: number;
  imageName: string;
}

const EnemyHandCard = (props: EnemyHandCardProps) => {
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const { id, index, imageName } = props;

  const { zIndex, cardWidth, top, rotate, cardHeight, left } = getCardStyleValues(id, currSnapshot);

  const normalStyles: CSSProperties = {
    zIndex: zIndex,
    width: cardWidth,
    height: cardHeight,

    //left: - 100 * (index - (numHandCards / 2 - 0.5)),
    top: top,
    left: left,
    position: "absolute",
    transform: `rotate(${rotate}deg)`,
    transition: `left 250ms, width 180ms, transform 180ms, opacity 300ms`,
    pointerEvents: "auto",
    boxShadow: "10px 10px 10px black",
  };
  const cardPlayer = locatePlayer(id);
  const ownerIsCurrentPlayer = useSelector((state: RootState) => state.gameSnapshotState.currSnapshot.current.player === cardPlayer);
  const currentPhaseIsDeal = useSelector((state: RootState) => state.gameSnapshotState.currSnapshot.current.phase === "dealPhase");
  // const disappearingStyles =
  //   ownerIsCurrentPlayer || currentPhaseIsDeal
  //     ? {
  //         opacity: 1,
  //       }
  //     : { opacity: 0 };

  return (

        <img
          alt={imageName}
          src={"./images/back.jpg"}
          // src={`./images/${imageName}.jpg`}
          draggable="false"
          style={{
            ...normalStyles,
            // ...disappearingStyles,
          }}
        />
    
  );
};
export default EnemyHandCard;
