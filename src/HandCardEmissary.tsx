import { CSSProperties, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import "./animations/animations.css";
import { handleEmissaryToData } from "./redux/handleIncomingEmissaryData";

export interface HandCardEmissaryProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  spread: number;
}

const HandCardEmissary = (props: HandCardEmissaryProps) => {
  const { id, index, image, dimensions, spread, numHandCards } = props;
  const { cardWidth, cardTopSpread, rotation, cardHeight } = dimensions;
  const emissaryRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  const normalStyles: CSSProperties = {
    width: cardWidth,
    height: cardHeight,
    top: index * cardTopSpread,
    left: spread * index - (spread * numHandCards) / 2,
    position: "absolute",
    transform: `rotate(${rotation(index)}deg)`,
  };

  /**
   * Called after the Emissary is created, passing its location to
   * the SnapshotChanges object...
   */
  useEffect(() => {
    if (emissaryRef !== null && emissaryRef.current !== null) {
      const element = emissaryRef.current;
      const { left, top } = element.getBoundingClientRect();
      dispatch(handleEmissaryToData({cardId: id, xPosition: left, yPosition: top}));
    }
  }, [dispatch, id]);

  return (
    <img
      alt={image}
      src={`./images/${image}.jpg`}
      ref={emissaryRef}
      id={id}
      style={{
        ...normalStyles,
      }}
    />
  );
};
export default HandCardEmissary;
