import React, { CSSProperties, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition, TransitionStatus } from "react-transition-group";
import { rotate } from "../helperFunctions/equations";
import { RootState } from "../redux/store";
import handleTransitionEnd from "../transitionFunctions.ts/handleTransitionEnd";

interface TransitionHandlerProps {
  index: number;
  id: string;
  render: (style: CSSProperties) => JSX.Element;
}

interface TransitionStylesObj {
  [status: string]: CSSProperties;
}

export const TransitionHandler = (props: TransitionHandlerProps) => {
  const { index, id } = props;
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.transitionData.find(t => t.cardId === id));
  // if(data){
  //   console.log(useSelector((state:RootState)=> stat))
  //   console.log(data)}
  if(data)console.log(data)
  let transitionStyles: TransitionStylesObj = data
    ? {
        entering: {
          transform: `rotate(${data.originDimensions.rotation(index)}deg)`,
          height: data.originDimensions.cardHeight,
          width: data.originDimensions.cardWidth,
          pointerEvents: "none",
          left: data.originDelta.x,
          top: data.originDelta.y,
          opacity: 0,
          zIndex: 100,
        },
        entered: {
          transitionDelay: `${data.wait}ms`,
          transition: `transform ${data.duration}ms ${data.curve},  height ${data.duration}ms ${data.curve}, width ${data.duration}ms ${data.curve}, left ${data.duration}ms ${data.curve}, top ${data.duration}ms ${data.curve}`,
          opacity: 1,
          
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
        ////TODO: data can only be TransitionData
        node.addEventListener("transitionend", () => {if(data)dispatch(handleTransitionEnd(data))}, false);
      }}
    >
      {state => props.render(transitionStyles[state])}
    </Transition>
  );

  // <div>{props.render(cardRef, handleClick, handleMouseLeave, inspectedStyle)}</div>;
};
export default TransitionHandler;
