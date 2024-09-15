import { useSelector } from "react-redux";
import { getCardStyleValues } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";

interface GhostCardProps {
  cardId: number;
  index: number;
  imageName: string;
  offsetLeft?: number;
  offsetTop?: number;
  rotation?: number;
  zIndex: number;
}

export const GhostCard = (props: GhostCardProps) => {
  const { rotation, imageName, index, offsetLeft, offsetTop, zIndex, cardId } = props;
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const { left, cardWidth } = getCardStyleValues(cardId, currSnapshot);
  const id = "ghostCard" + imageName;
  console.log("GhostCard");

  return (
    <img
      alt={imageName}
      src={`./images/${imageName}.jpg`}
      id={id}
      style={{
        WebkitFilter: "grayscale(100%)",
        opacity: 0.7,
        width: cardWidth,
        border: "thin solid",
        left: index * left + (offsetLeft || 0),
        top: offsetTop || 0,
        rotate: rotation + "deg" || "0deg",
        position: "absolute",
        transition: "left 250ms ease",
        zIndex: zIndex,
      }}
    />
  );
};
export default GhostCard;
