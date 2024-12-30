import { forwardRef } from "react";
import AnimationHandler from "../animations/AnimationHandler";
import { RefMap } from "../animations/animationHelperFunctions";
import { getFrontAndBackStyles, getInnerWrapperStyle, getOuterWrapperStyles } from "../helperFunctions/getCardStyles";

export interface AnimatedCardProps {
  id: number;
  index: number;
  image: string;
  currAnimations: AnimationData[];
  gameSnapshot: GameSnapshot;
}

const AnimatedCard = forwardRef<RefMap, AnimatedCardProps>((props, cardsRef) => {
  
  const { currAnimations, image, index, id, gameSnapshot } = props;

  const mainAnimation = currAnimations.find(ani => ani.track === "main");
  const opacityAnimation = currAnimations.find(ani => ani.track === "opacityAndShadow");
  const zIndexAnimation = currAnimations.find(ani => ani.track === "zIndex");

  const innerWrapperStyle = getInnerWrapperStyle(id, gameSnapshot);
  const frontAndBackStyles = getFrontAndBackStyles(id, gameSnapshot);
  const outerWrapperStyle = getOuterWrapperStyles();

  return (
    <AnimationHandler animationData={mainAnimation}>
      {mainAnimationProps => (
        <>
          <AnimationHandler animationData={opacityAnimation}>
            {opacityAnimationProps => (
              <>
                <AnimationHandler animationData={zIndexAnimation}>
                  {zIndexAnimationProps => (
                    <div style={outerWrapperStyle} className={zIndexAnimationProps.className}>
                      <div style={innerWrapperStyle} className={mainAnimationProps.className}>
                        <img
                          src={`./${image}`}
                          className={opacityAnimationProps.className}
                          alt={`${id}`}
                          draggable={false}
                          style={frontAndBackStyles}
                        />
                        <img
                          className={opacityAnimationProps.className}
                          src="./back.jpg"
                          alt=""
                          style={{ transform: `rotateY(180deg)`, ...frontAndBackStyles }}
                        />
                      </div>
                    </div>
                  )}
                </AnimationHandler>
              </>
            )}
          </AnimationHandler>
        </>
      )}
    </AnimationHandler>
  );
});
export default AnimatedCard;
