import AnimationHandler from "../animations/AnimationHandler";
import { getCardName } from "../animations/animationHelperFunctions";
import {
    getFrontAndBackStyles,
    getInnerWrapperStyle,
    getOuterWrapperStyles,
} from "../helperFunctions/getCardStyles";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";
import { getCard } from "../helperFunctions/locateFunctions";
export interface AnimatedCardGroupProps {
    cardGroup: NewCardGroupObj;
    currAnimations: AnimationData[];
    gameSnapshot: GameSnapshot;
}

const AnimatedCardGroup: React.FC<AnimatedCardGroupProps> = (props) => {
    const { currAnimations, cardGroup, gameSnapshot } = props;
    const { cards } = cardGroup;

    const mainAnimations = currAnimations.filter((ani) => ani.track === "main");
    mainAnimations.sort((a, b) => (a.cardId === cards[0].id ? -1 : 1));
    const opacityAnimations = currAnimations.filter((ani) => ani.track === "opacityAndShadow");
    opacityAnimations.sort((a, b) => (a.cardId === cards[0].id ? -1 : 1));
    const zIndexAnimations = currAnimations.filter((ani) => ani.track === "zIndex");
    zIndexAnimations.sort((a, b) => (a.cardId === cards[0].id ? -1 : 1));
    // TODO sorting for BFF three card animation!

    const innerWrapperStyles = cards.map((c) => getInnerWrapperStyle(c.id, gameSnapshot));
    const frontAndBackStyles = cards.map((c) => getFrontAndBackStyles(c.id, gameSnapshot));
    const outerWrapperStyles = getOuterWrapperStyles();

    return (
        <>
            {cards.map((card, idx) => (
                <AnimationHandler animationData={mainAnimations[idx]} key={card.id + "main"}>
                    {(mainAnimationProps) => (
                        <>
                            <AnimationHandler animationData={opacityAnimations[idx]}>
                                {(opacityAnimationProps) => (
                                    <>
                                        <AnimationHandler animationData={zIndexAnimations[idx]}>
                                            {(zIndexAnimationProps) => (
                                                <div
                                                    style={outerWrapperStyles}
                                                    className={zIndexAnimationProps.className}
                                                    key={card.id + "outer"}
                                                >
                                                    <div
                                                        style={innerWrapperStyles[idx]}
                                                        className={mainAnimationProps.className}
                                                        key={card.id + "inner"}
                                                    >
                                                        <img
                                                            src={`./images/${card.imageName}.jpg`}
                                                            className={
                                                                opacityAnimationProps.className
                                                            }
                                                            alt={`${card.imageName}`}
                                                            draggable={false}
                                                            style={frontAndBackStyles[idx]}
                                                            key={card.id + "front"}
                                                        />
                                                        <img
                                                            className={
                                                                opacityAnimationProps.className
                                                            }
                                                            src="./images/back.jpg"
                                                            alt=""
                                                            style={{
                                                                transform: `rotateY(180deg)`,
                                                                ...frontAndBackStyles[idx],
                                                            }}
                                                            key={card.id + "back"}
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
            ))}
        </>
    );

    // if(getCardName(card) === "startgast_saufnase" || getCardName(card) === "zwilling") {
    //   console.log("place cardGroupId: ", mainAnimation?.placeId);
    //   console.log(mainAnimation?.keyframesString);

    // }

    // Zwilling
    // return (
    //   <AnimationHandler animationData={mainAnimation}>
    //     {mainAnimationProps => (
    //       <>
    //         <AnimationHandler animationData={opacityAnimation}>
    //           {opacityAnimationProps => (
    //             <>
    //               <AnimationHandler animationData={zIndexAnimation}>
    //                 {zIndexAnimationProps => (
    //                   <div style={outerWrapperStyle} className={zIndexAnimationProps.className}>

    //                     <div style={innerWrapperStyle} className={mainAnimationProps.className}>
    //                       <img
    //                         src={`./images/${imageNames[0]}.jpg`}
    //                         className={opacityAnimationProps.className}
    //                         alt={`${cardGroupId}`}
    //                         draggable={false}
    //                         style={frontAndBackStyles}
    //                       />
    //                       <img
    //                         src={`./images/${imageNames[1]}.jpg`}
    //                         className={opacityAnimationProps.className}
    //                         alt={`${cardGroupId}`}
    //                         draggable={false}
    //                         style={{...frontAndBackStyles, top: zwillingTop}}
    //                       />
    //                     </div>
    //                   </div>
    //                 )}
    //               </AnimationHandler>
    //             </>
    //           )}
    //         </AnimationHandler>
    //       </>
    //     )}
    //   </AnimationHandler>
    // );
};
export default AnimatedCardGroup;
