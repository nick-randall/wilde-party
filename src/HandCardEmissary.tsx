import { CSSProperties, useEffect, useRef, useState } from "react";
import { Draggable, DraggableProvidedDraggableProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";
import Dragger from "./dndcomponents/Dragger";
import { sendEmissaryDispatch } from "./redux/actionCreators";

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
      dispatch(sendEmissaryDispatch(id, left, top));
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
