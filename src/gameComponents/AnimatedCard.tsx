import { useRef } from "react";
import AnimationHandler from "../animations/AnimationHandler";
import {
    getFrontAndBackStyles,
    getInnerWrapperStyle,
    getOuterWrapperStyles,
} from "../helperFunctions/getCardStyles";
export interface AnimatedCardProps {
    id: number;
    imageName: string;
    currAnimations: AnimationData[];
    gameSnapshot: GameSnapshot;
}

const AnimatedCard: React.FC<AnimatedCardProps> = (props) => {
    const { currAnimations, imageName, id, gameSnapshot } = props;

    const mainAnimation = currAnimations.find((ani) => ani.track === "main");
    const opacityAnimation = currAnimations.find((ani) => ani.track === "opacityAndShadow");
    const zIndexAnimation = currAnimations.find((ani) => ani.track === "zIndex");

    const innerWrapperStyle = getInnerWrapperStyle(id, gameSnapshot);
    const frontAndBackStyles = getFrontAndBackStyles(id, gameSnapshot);
    const outerWrapperStyle = getOuterWrapperStyles();
    const ref = useRef<HTMLImageElement>(null);

    return (
        <AnimationHandler animationData={mainAnimation}>
            {(mainAnimationProps) => (
                <>
                    <AnimationHandler animationData={opacityAnimation}>
                        {(opacityAnimationProps) => (
                            <>
                                <AnimationHandler animationData={zIndexAnimation}>
                                    {(zIndexAnimationProps) => (
                                        <div
                                            style={outerWrapperStyle}
                                            className={zIndexAnimationProps.className}
                                        >
                                            <div
                                                style={innerWrapperStyle}
                                                className={mainAnimationProps.className}
                                            >
                                                <img
                                                    ref={ref}
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
                                                    style={{
                                                        transform: `rotateY(180deg)`,
                                                        ...frontAndBackStyles,
                                                    }}
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
export default AnimatedCard;
