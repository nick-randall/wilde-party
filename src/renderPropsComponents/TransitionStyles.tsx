import React, { CSSProperties, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition, TransitionStatus } from "react-transition-group";
import { rotate } from "../helperFunctions/equations";
import { RootState } from "../redux/store";

interface TransitionStylesProps {
  //data: TransitionData | undefined;
  // dimensions: AllDimensions;
  index: number;
  id: string;
  render: (style: CSSProperties) => JSX.Element;
}

interface TransitionStylesObj {
  [status: string]: {};
}

export const TransitionStyles = (props: TransitionStylesProps) => {
  const { index, id } = props;
  //const { cardHeight, cardWidth, scale } = dimensions;
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.transitionData.find(t => t.cardId === id));

  let transitionStyles: TransitionStylesObj = data
    ? {
        entering: {
          transform: `rotate(${data.originDimensions.rotation(index)}deg) translateX(${data.originDelta.x}px) translateY(${data.originDelta.y}px`,
          height: data.originDimensions.cardHeight,
          width: data.originDimensions.cardWidth,
          pointerEvents: "none",
        },
        entered: {
          transition: `transform ${data.duration}ms ${data.curve},  height ${data.duration}ms ${data.curve}, width ${data.duration}ms ${data.curve}, left ${data.duration}ms ${data.curve}, top ${data.duration}ms ${data.curve}`,
        },
      }
    : {};

  return (
    <Transition
      in={true}
      timeout={0}
      //timeout={data !== undefined ? data.startAnimationDuration : 0}
      appear={true}
      addEndListener={(node: HTMLElement) => {
        node.addEventListener("transitionend", () => dispatch({ type: "REMOVE_TRANSITION", payload: id }), false);
      }}
    >
      {state => props.render(transitionStyles[state])}
    </Transition>
  );

  // <div>{props.render(cardRef, handleClick, handleMouseLeave, inspectedStyle)}</div>;
};
export default TransitionStyles;
