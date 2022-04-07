import { CSSProperties, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { sendEmissaryDispatch } from "./redux/actionCreators";

export interface CardEmissaryProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
  placeId: string;
}

/**
 * Not for HandCards
 * @param props.image
 * @returns
 */

const CardEmissary: React.FC<CardEmissaryProps> = ({ id, image, dimensions, offsetLeft, offsetTop }) => {
  const { tableCardzIndex, cardHeight, cardWidth } = dimensions;
  const emissaryRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft,
    top: offsetTop,
    position: "absolute",
    userSelect: "none",
  };
  /**
   * Called after the Emissary is created, passing its location to 
   * the SnapshotChanges object...
   */
  useEffect(() => {
    if (emissaryRef !== null && emissaryRef.current !== null) {
      const element = emissaryRef.current;
      const { left, top } = element.getBoundingClientRect();
      dispatch(sendEmissaryDispatch(id, left, top));
    }
  }, [dispatch, id]);

  return (
    <img
      ref={emissaryRef}
      alt={image}
      draggable="false"
      src={`./images/${image}.jpg`}
      style={{
        ...normalStyles,
      }}
    />
  );
};

export default CardEmissary;
