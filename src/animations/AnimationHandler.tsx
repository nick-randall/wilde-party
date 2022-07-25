import { useDispatch, useSelector } from "react-redux";
import Transition from "react-transition-group/Transition";
import styled, { keyframes } from "styled-components";
import { RootState } from "../redux/store";

interface AnimationHandlerProvidedProps {
  animated: boolean;
  className?: string;
}
export interface AnimationHandlerProps {
  //These should be retrieved from redux
  cardId: string;
  className?: string;
  frontImgSrc: string;
  backImgSrc: string;
  children: (animationHandlerProvidedProps: AnimationHandlerProvidedProps) => JSX.Element;
}

interface CalculatedAnimationData {
  id: string;
  originDelta: { x: number; y: number };
  transitionCurve: string;
  initialRotation: number;
  finalRotation: number;
  totalDuration: number;
  waitAsPercent: number;
  startAnimation: string;
  originWidth: number;
  finalWidth: number;
  originHeight: number;
  finalHeight: number;
  startAnimationDurationAsPercent: number;
  frontImgSrc: string;
  backImgSrc: string;
}

// The Exported Component with access to Redux
const AnimationHandler: React.FC<AnimationHandlerProps> = ({ cardId, children, frontImgSrc, backImgSrc }) => {
  // const animation = animationData.find(data => data.id === id);

  const animationData = useSelector((state: RootState) => state.animationData.find(animation => animation.cardId === cardId));

  const animated = animationData !== undefined;
  const originDelta = animationData?.originDelta || { x: 0, y: 0 };
  let transitionDuration = animationData?.transitionDuration || 0;
  const initialRotation = animationData?.initialRotation || 0;
  const finalRotation = animationData?.finalRotation || 0;
  const startAnimation = animationData?.startAnimation || "";
  let startAnimationDuration = animationData?.startAnimationDuration || 0;
  let wait = animationData?.wait || 0;
  const transitionCurve = animationData?.transitionCurve || "";
  const originWidth = animationData?.originDimensions.cardWidth || 0;
  const finalWidth = animationData?.finalDimensions.cardWidth || 0;
  const originHeight = animationData?.originDimensions.cardHeight || 0;
  const finalHeight = animationData?.finalDimensions.cardHeight || 0;

  // derived values

  // Convert startAnimationDuration to a percentage.
  // Set totalDuration to be transitionDuration plus the startAnimationDuration plus the wait time
  // This causes the initial animation to occur before the card then moves
  // if (startAnimation) {
  const totalDuration = transitionDuration + startAnimationDuration + wait;
  const startAnimationDurationAsPercent = (startAnimationDuration / totalDuration) * 100;
  const waitAsPercent = (wait / totalDuration) * 100;

  return (
    <InjectedAnimationHandler
      id={cardId}
      originDelta={originDelta}
      transitionCurve={transitionCurve}
      initialRotation={initialRotation}
      finalRotation={finalRotation}
      originWidth={originWidth}
      finalWidth={finalWidth}
      originHeight={originHeight}
      finalHeight={finalHeight}
      totalDuration={totalDuration}
      waitAsPercent={waitAsPercent}
      startAnimation={startAnimation}
      startAnimationDurationAsPercent={startAnimationDurationAsPercent}
      frontImgSrc={frontImgSrc}
      backImgSrc={backImgSrc}
      animated={animated}
      children={children}
    />
  );
};

type InjectedAnimationHandlerProps = CalculatedAnimationData & {
  animated: boolean;
  frontImgSrc: string;
  backImgSrc: string;
  className?: string;
  children: (animationHandlerProvidedProps: AnimationHandlerProvidedProps) => React.ReactNode;
};

/**
 * This component receives all animation data but can't access it directly.
 * Instead, the InjectedAnimationHandler uses the animation data (to, from, delay etc.)
 * to build a dynamic animation.
 * @param param0
 * @returns
 */
const AnimationLoader: React.FC<InjectedAnimationHandlerProps> = ({ className, children, animated, id }) => {
  const providedProps: AnimationHandlerProvidedProps = {
    animated: animated,
    className: className,
  };
  return (
    //  <>{children(providedProps)}</>;
    <Transition in={true} addEndListener={() => {}}>
      {state => (state === "entering" ? children({ animated: animated, className: "" }) : children(providedProps))}
    </Transition>
  );
};

const flip = (
  originDelta: { x: number; y: number },
  backImgSrc: string,
  frontImgSrc: string,
  initialRotation: number,
  finalRotation: number,
  originWidth: number,
  finalWidth: number,
  originHeight: number,
  finalHeight: number,
  wait?: number
) => keyframes`
  0% {
   width: ${originWidth}px;
   height: ${originHeight}px;
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${initialRotation}deg);
    content: url("${backImgSrc}");
  }
  ${wait}% {
   width: ${originWidth}px;
   height: ${originHeight}px;
   transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${initialRotation}deg);
   content: url("${backImgSrc}");

  }
   100% {
    width: ${finalWidth}px;
    height: ${finalHeight}px;
    transform: translate(0px, 0px) rotate3d(0, 1, 0, 0deg) rotate(${finalRotation}deg);
    content: url("${frontImgSrc}");
  }
`;

const noAnimation = (
  originDelta: { x: number; y: number },
  initialRotation: number,
  finalRotation: number,
  originWidth: number,
  finalWidth: number,
  originHeight: number,
  finalHeight: number,
  waitAsPercent?: number
) => keyframes`
  0% {
    width: ${originWidth}px;
    height: ${originHeight}px;
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate(${initialRotation}deg);
  }
  ${waitAsPercent}% {
    width: ${originWidth}px;
    height: ${originHeight}px;
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate(${initialRotation}deg);
  }
  100% {
    width: ${finalWidth}px;
    height: ${finalHeight}px;
    transform: translate(0px, 0px) rotate(${finalRotation}deg);
  }
`;

const flipGrowThenMoveAnimation = (
  originDelta: { x: number; y: number },
  backImgSrc: string,
  frontImgSrc: string,
  initialRotation?: number,
  startAnimationDuration?: number,
  wait?: number
) => keyframes`
  0% {
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${initialRotation}deg) scale(1);
    content: url("${backImgSrc}");
  }
  ${wait}% {
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate3d(0, 1, 0, 180deg) rotate(${initialRotation}deg) scale(1);
    content: url("${backImgSrc}");
  }
   ${startAnimationDuration}% {
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate3d(0, 1, 0, 0deg) rotate(0deg) scale(2.6);
    content: url("${frontImgSrc}");
  }
  100% {
    transform: translate(0px, 0px) rotate3d(0, 1, 0, 0deg) rotate(0deg) scale(1);
    content: url("${frontImgSrc}");
  }
`;

// The StyledComponent
const InjectedAnimationHandler = styled(AnimationLoader)<InjectedAnimationHandlerProps>`
  animation: ${props =>
      props.startAnimation === "flip"
        ? flip(
            props.originDelta,
            props.backImgSrc,
            props.frontImgSrc,
            props.initialRotation,
            props.finalRotation,
            props.originWidth,
            props.finalWidth,
            props.originHeight,
            props.finalHeight,
            props.waitAsPercent
          )
        : noAnimation(
            props.originDelta,
            props.initialRotation,
            props.finalRotation,
            props.originWidth,
            props.finalWidth,
            props.originHeight,
            props.finalHeight,
            props.waitAsPercent
          )}
    ${props => props.totalDuration}ms;
`;

export default AnimationHandler;
