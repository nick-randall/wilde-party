import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { RootState } from "../redux/store";

interface AnimationHandlerProvidedProps {
  animated: boolean;
  className?: string;
}
export interface AnimationHandlerProps {
  cardId: string;
  className?: string;
  children: (animationHandlerProvidedProps: AnimationHandlerProvidedProps) => JSX.Element;
}

const AnimationHandler: React.FC<AnimationHandlerProps> = ({ cardId, children }) => {
  const animationData = useSelector((state: RootState) => state.animationData.find(animation => animation.cardId === cardId));
  const keyframesString = animationData?.keyframesString ?? "";

  return <InjectedAnimationHandler keyframesString={keyframesString} animated={animationData !== undefined} children={children} />;
};


type InjectedAnimationHandlerProps = {
  keyframesString: string;
  animated: boolean;
  className?: string;
  children: (animationHandlerProvidedProps: AnimationHandlerProvidedProps) => React.ReactNode;
};

/**
 * This component receives all animation data but can't access it directly.
 * Instead, the InjectedAnimationHandler uses the animation data (to, from, delay etc.)
 * contained in the css class (className prop) to build a dynamic animation.
 * @param param0
 * @returns
 */
const AnimationLoader: React.FC<InjectedAnimationHandlerProps> = ({ className, children, animated }) => {
  const providedProps: AnimationHandlerProvidedProps = {
    animated: animated,
    className: className,
  };
  return <>{children(providedProps)}</>;
};

const InjectedAnimationHandler = styled(AnimationLoader)<InjectedAnimationHandlerProps>`
  animation: ${props => keyframes`${props.keyframesString}`} 1000ms;
`;

export default AnimationHandler