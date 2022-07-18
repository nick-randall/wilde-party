import { keyframes } from "styled-components";

export interface AnimationProps {
  originDelta: { x: number; y: number },
  backImgSrc: string,
  frontImgSrc: string,
  initialRotation: number,
  finalRotation: number,
  startAnimationDuration: number;
  originWidth: number,
  finalWidth: number,
  originHeight: number,
  finalHeight: number,
  wait?: number
}


const animations = {
  dynamicAnimation: (
   props: AnimationProps
  ) => keyframes`
  0% {
   width: ${props.originWidth}px;
   height: ${props.originHeight}px;
    transform: translate(${props.originDelta.x}px, ${props.originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${props.initialRotation});
    content: url("${props.backImgSrc}");


  }
  ${props.wait}% {
   width: ${props.originWidth}px;
   height: ${props.originHeight}px;
   transform: translate(${props.originDelta.x}px, ${props.originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${props.initialRotation});
   content: url("${props.backImgSrc}");

  }
   100% {
    width: ${props.finalWidth}px;
    height: ${props.finalHeight}px;
    transform: translate(0px, 0px) rotate3d(0, 1, 0, 0deg) rotate(${props.finalRotation}deg);
    content: url("${props.frontImgSrc}");

  }
`,
  flipGrowThenMoveAnimation: (
    props: AnimationProps
  ) => keyframes`
  0% {
    transform: translate(${props.originDelta.x}px, ${props.originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${props.initialRotation}deg) scale(1);
    content: url("${props.backImgSrc}");
  }
  ${props.wait}% {
    transform: translate(${props.originDelta.x}px, ${props.originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${props.initialRotation}deg) scale(1);
    content: url("${props.backImgSrc}");
  }
   ${props.startAnimationDuration}% {
    transform: translate(${props.originDelta.x}px, ${props.originDelta.y}px) rotate3d(0, 1, 0, 0deg) rotate(0deg) scale(2.6);
    content: url("${props.frontImgSrc}");
  }
  100% {
    transform: translate(0px, 0px) rotate3d(0, 1, 0, 0deg) rotate(0deg) scale(1);
    content: url("${props.frontImgSrc}");
  }
`,
};

export default animations;