import { CSSProperties, FC, ForwardedRef, forwardRef } from "react";
import { useDispatch } from "react-redux";
import AnimationHandler from "../animations/AnimationHandler";
import handleEndAnimation from "../animations/handleEndAnimation";

interface CardBaseProps {
  id: string;
  image: string;
  dimensions: AllDimensions;
  children?: React.ReactNode;
  rotateX: number;
  greyedOut?: boolean;
  // className?: string;
  offsetLeft?: number;
  offsetTop?: number;
  extraStyles?: CSSProperties;
  // isAnimated: boolean;
  // draggingStyles: CSSProperties
}

const CardBase = forwardRef<HTMLImageElement, CardBaseProps>(
  ({ id, image, dimensions, rotateX, greyedOut, offsetLeft, offsetTop, extraStyles, children }, mockRenderRef: ForwardedRef<HTMLImageElement>) => {
    const { tableCardzIndex, cardHeight, cardWidth, rotateY } = dimensions;
    const dispatch = useDispatch();

    const outerStyles: CSSProperties = {
      height: cardHeight,
      width: cardWidth,
      transformOrigin: "50% 50%" /*seems to do nothing?*/,
      transformStyle: "preserve-3d",
      position: "absolute",
      pointerEvents: "none",

    };

    const innerStyles: CSSProperties = {
      zIndex: tableCardzIndex,
      width: "100%",
      height: "100%",
      left: offsetLeft || 0,
      top: offsetTop || 0,
      position: "relative",
      transform: `rotate(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "300ms",
      boxShadow: "2px 2px 2px black",
      ...extraStyles, 
      userSelect: "none",
      backfaceVisibility: "hidden",
      transformOrigin: "50% 50%" /*seems to do nothing?*/,
      transformStyle: "preserve-3d",

    };

    const frontAndBackStyles: CSSProperties = {
      width: "100%",
      height: "100%",
      position: "absolute",
      backfaceVisibility: "hidden",
      ...extraStyles
    };

    return (
      <AnimationHandler cardId={id} frontImgSrc={`./images/${image}.jpg`} backImgSrc={`./images/back.jpg`}>
        {animationProvidedProps => (
          <div ref={mockRenderRef} style={{ pointerEvents: animationProvidedProps.animated ? "none" : "auto", ...outerStyles }}>
            <div style={innerStyles} onAnimationEnd={() => dispatch(handleEndAnimation(id))} className={animationProvidedProps.className}>
              <img
                // ref={mockRenderRef}
                alt={image}
                draggable="false"
                src={`./images/${image}.jpg`}
                id={id}
                style={{
                  WebkitFilter: greyedOut ? "grayscale(100%)" : "",
                  ...frontAndBackStyles,
                }}
              />
              <img
                alt={image}
                draggable="false"
                src={"./images/back.jpg"}
                id={id}
                style={{
                  transform: `rotateY(180deg)`,
                  ...frontAndBackStyles,
                }}
              />
              {children}
            </div>
          </div>
        )}
      </AnimationHandler>
    );
  }
);

export default CardBase;
