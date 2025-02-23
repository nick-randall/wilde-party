import AnimationHandler from "../animations/AnimationHandler";
import { dimensionConstants, getFrontAndBackStyles, getInnerWrapperStyle, getOuterWrapperStyles } from "../helperFunctions/getCardStyles";
export interface AnimatedHandCardProps {
  id: number;
  index: number;
  imageName: string;
  currAnimations: AnimationData[];
  gameSnapshot: GameSnapshot;
}

const AnimatedHandCard : React.FC<AnimatedHandCardProps> = (props) => {
  
  const { currAnimations, imageName, index, id, gameSnapshot } = props;

  const mainAnimation = currAnimations.find(ani => ani.track === "main");
  const opacityAnimation = currAnimations.find(ani => ani.track === "opacityAndShadow");
  const zIndexAnimation = currAnimations.find(ani => ani.track === "zIndex");

  const innerWrapperStyle = getInnerWrapperStyle(id, gameSnapshot);
  const frontAndBackStyles = getFrontAndBackStyles(id, gameSnapshot);
  const outerWrapperStyle = getOuterWrapperStyles();

  // outer
  // pointerEvents: "none"
  // position: "absolute"
  // transformOrigin: "50% 50%"
  // transformStyle: "preserve-3d"
  // zIndex: 9

  //inner 
  // borderRadius: 6
  // height: "180px"
  // left: "140px"
  // position: "absolute"
  // scale: "1"
  // top: "0px"
  // transform: "rotate(10deg) rotateY(0deg) scale(1)"
  // transformStyle: "preserve-3d"
  // transition: "300ms"
  // userSelect: "none"
  // width: "116.75999999999999px
  // zIndex: 5

  // frontAndBack
  // backfaceVisibility: "hidden"
  // borderRadius: 6
  // boxShadow: "10px 10px 10px black"
  // height: "100%"
  // position: "absolute"
  // width: "100%"
  return (
    <AnimationHandler animationData={mainAnimation}>
      {mainAnimationProps => (
        <>
          <AnimationHandler animationData={opacityAnimation}>
            {opacityAnimationProps => (
              <>
                <AnimationHandler animationData={zIndexAnimation}>
                  {zIndexAnimationProps => (
                    <div style={{ position: "relative", width: 0, display: "flex" }}>
                      
                      <div style={outerWrapperStyle} className={zIndexAnimationProps.className}>
                         <div
                            // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                            style={{
                                width: 40, //spread / 2,
                                transition: "all 180ms",
                                // height: styles.cardHeight,
                                height: dimensionConstants.HAND_CARD_HEIGHTS["self"]
                                // border:"thin green solid",
                                // zIndex: 100
                            }}
                            className="spacer-div"
                        />
                        <div style={innerWrapperStyle} className={mainAnimationProps.className}>
                          <img
                            src={`./images/${imageName}.jpg`}
                            className={opacityAnimationProps.className}
                            alt={`${id}`}
                            draggable={false}
                            style={frontAndBackStyles}
                          />
                          <img
                            className={opacityAnimationProps.className}
                            src="./images/back.jpg"
                            alt=""
                            style={{ transform: `rotateY(180deg)`, ...frontAndBackStyles }}
                          />
                        </div>
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
export default AnimatedHandCard;
