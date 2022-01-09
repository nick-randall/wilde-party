import React, { CSSProperties, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition, TransitionStatus } from "react-transition-group";
import { rotate } from "../helperFunctions/equations";
import { RootState } from "../redux/store";

interface TransitionHandlerProps {
  index: number;
  id: string;
  render: (style: CSSProperties) => JSX.Element;
}

interface TransitionStylesObj {
  [status: string]: {};
}

export const TransitionHandler = (props: TransitionHandlerProps) => {
  const { index, id } = props;
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.transitionData.find(t => t.cardId === id));
  // if(data){
  //   console.log(useSelector((state:RootState)=> stat))
  //   console.log(data)}
  let transitionStyles: TransitionStylesObj = data
    ? {
        entering: {
          transform: `rotate(${data.originDimensions.rotation(index)}deg)`,
          height: data.originDimensions.cardHeight,
          width: data.originDimensions.cardWidth,
          pointerEvents: "none",
          left: data.originDelta.x,
          top: data.originDelta.y,
          opacity : 0
        },
        entered: {
          transition: `transform ${data.duration}ms ${data.curve},  height ${data.duration}ms ${data.curve}, width ${data.duration}ms ${data.curve}, left ${data.duration}ms ${data.curve}, top ${data.duration}ms ${data.curve}`,
          opacity:1
        },
      }
    : {};

  return (
    <Transition
      in={true}
      //timeout={0}
      timeout={data !== undefined ? data.wait : 0}
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
export default TransitionHandler;
