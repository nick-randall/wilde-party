import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { RootState } from "../../redux/store";

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
  totalDuration: number;
  waitAsPercent: number;
  startAnimation: string;
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
  const startAnimation = animationData?.startAnimation || "";
  let startAnimationDuration = animationData?.startAnimationDuration || 0;
  let wait = animationData?.wait || 0;
  const transitionCurve = animationData?.transitionCurve || "";

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
const AnimationLoader: React.FC<InjectedAnimationHandlerProps> = ({ className, children, animated, id}) => {

  const providedProps: AnimationHandlerProvidedProps = {
    animated: animated,
    className: className,
  };
  return <div>{children(providedProps)}</div>;
};

const dynamicAnimation = (originDelta: { x: number; y: number }, backImgSrc: string, frontImgSrc: string, initialRotation?: number, wait?: number) => keyframes`
  0% {
    transform: translate(0px, 0px) rotate3d(0, 0, 0, 0deg) rotate(0deg);

  }
  ${wait}% {
    transform: translate(0px, 0px) rotate3d(0, 0, 0, 0deg) rotate(0deg);
  }
   100% {
    transform: translate(${originDelta.x}px, ${originDelta.y}px) rotate3d(0, 0, 0, 0deg) rotate(${initialRotation}deg);

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
    transform: translate(0px, 0px) rotate3d(0, 1, 0, 00deg) rotate(0deg) scale(1);
    content: url("${frontImgSrc}");
  }
`;

// The StyledComponent
const InjectedAnimationHandler = styled(AnimationLoader)<InjectedAnimationHandlerProps>`
  animation: ${props =>
      props.startAnimation === "flipGrow"
        ? flipGrowThenMoveAnimation(
            props.originDelta,
            props.backImgSrc,
            props.frontImgSrc,
            props.initialRotation,
            props.startAnimationDurationAsPercent,
            props.waitAsPercent
          )
        : dynamicAnimation(props.originDelta, props.backImgSrc, props.frontImgSrc, props.initialRotation, props.waitAsPercent)}
    ${props => props.totalDuration}ms;
`;

export default AnimationHandler;
