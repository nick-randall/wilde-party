import AnimationHandler from "../animations/AnimationHandler";
import { getFrontAndBackStyles, getInnerWrapperStyle, getOuterWrapperStyles } from "../helperFunctions/getCardStyles";
export interface AnimatedCardGroupProps {
  id: number;
  imageNames: string[];
  currAnimations: AnimationData[];
  gameSnapshot: GameSnapshot;
}

const AnimatedCardGroup : React.FC<AnimatedCardGroupProps> = (props) => {
  
  const { currAnimations, imageNames,  id, gameSnapshot } = props;

  const mainAnimation = currAnimations.find(ani => ani.track === "main");
  const opacityAnimation = currAnimations.find(ani => ani.track === "opacityAndShadow");
  const zIndexAnimation = currAnimations.find(ani => ani.track === "zIndex");

  const innerWrapperStyle = getInnerWrapperStyle(id, gameSnapshot);
  const frontAndBackStyles = getFrontAndBackStyles(id, gameSnapshot);
  const outerWrapperStyle = getOuterWrapperStyles();

  const {top, height} = getInnerWrapperStyle(id, gameSnapshot);
  let zwillingTop = 0;
  if(typeof top === "string" && typeof height === "string") {
    const stripped = top.replace("px", "");
    const topNum = parseInt(stripped);

    const strippedHeight = height.replace("px", "");
    const heightNum = parseInt(strippedHeight);
    zwillingTop = topNum + heightNum / 2;
  
    console.log("top: ", topNum);
}


  // Zwilling
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
                          src={`./images/${imageNames[0]}.jpg`}
                          className={opacityAnimationProps.className}
                          alt={`${id}`}
                          draggable={false}
                          style={frontAndBackStyles}
                        />
                        <img
                          src={`./images/${imageNames[1]}.jpg`}
                          className={opacityAnimationProps.className}
                          alt={`${id}`}
                          draggable={false}
                          style={{...frontAndBackStyles, top: zwillingTop}}
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
};
export default AnimatedCardGroup;
