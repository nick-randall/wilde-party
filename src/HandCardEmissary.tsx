import { CSSProperties, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import "./animations/animations.css";
import { handleEmissaryToData } from "./transitionFunctions/handleIncomingEmissaryData";

export interface HandCardEmissaryProps {
  id: string;
  silent: boolean;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  spread: number;
}
/**
 * Emissaries are objects rendered invisibly by their parent component.
 * Their purpose is to use the rendering engine to determine where an
 * object (usually a Card) will be rendered. As soon as it is invisibly
 * rendered, it sends its location back to Redux, providing the coordinates
 * needed for building a transition (following a rebuild by React).
 * @param props 
 * @returns 
 */
const HandCardEmissary = (props: HandCardEmissaryProps) => {
  const { id, silent, index, image, dimensions, spread, numHandCards } = props;
  const { cardWidth, cardTopSpread, rotation, cardHeight } = dimensions;
  const emissaryRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const normalStyles: CSSProperties = {
    width: cardWidth,
    height: cardHeight,
    top: index * cardTopSpread,
    left: 0,//spread * index,
    position: "absolute",
    // transform: `rotate(${rotation(index)}deg)`,
    // backgroundColor: "black"
  };

  /**
   * Called after the Emissary is created, passing its location to
   * the SnapshotChanges object...
   */
  useEffect(() => {
    console.log("inside use effect")
    if (emissaryRef !== null && emissaryRef.current !== null) {
      console.log("!silent && emissaryRef !== null && emissaryRef.current !== null")

      const element = emissaryRef.current;
      const { left, top } = element.getBoundingClientRect();
      console.log("handCard EmissaryTo cardId: " + id);
      dispatch(handleEmissaryToData({cardId: id, xPosition: left, yPosition: top}));
    }
  }, [silent, dispatch, id]);

  return (
    <div
      ref={emissaryRef}
      id={id}
      style={{
        ...normalStyles,
      }}
    />
  );
};
export default HandCardEmissary;
