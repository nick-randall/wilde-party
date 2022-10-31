import { CSSProperties, FC, ForwardedRef, forwardRef } from "react";
import { useDispatch } from "react-redux";
import handleEndAnimation from "../animations/handleEndAnimation";

interface CardBaseProps {
  id: string;
  image: string;
  dimensions: AllDimensions;
  children?: React.ReactNode;
  rotateX: number;
  greyedOut?: boolean;
  className?: string;
  offsetLeft?: number;
  offsetTop?: number;
}

const CardBase = forwardRef<HTMLImageElement, CardBaseProps>(
  ({ id, image, dimensions, rotateX, greyedOut, className, offsetLeft, offsetTop, children }, mockRenderRef: ForwardedRef<HTMLImageElement>) => {
    const { tableCardzIndex, cardHeight, cardWidth, facing } = dimensions;
    const dispatch = useDispatch();

    const frontAndBackStyles: CSSProperties = {
      width: "100%",
      height: "100%",
      position:"absolute",
      backfaceVisibility: "hidden"
    };

    const innerStyles: CSSProperties = {
      zIndex: tableCardzIndex,
      width: "100%",
      height: "100%",
      left: offsetLeft || 0,
      top: offsetTop || 0,
      position: "relative",
      transform: `rotate(${rotateX}deg) rotate3d(0, 1, 0, ${facing === "front" ? 0 : 180}deg)`,
      transition: "300ms",
      boxShadow: "2px 2px 2px black",
      userSelect: "none",
      backfaceVisibility: "hidden",
      transformOrigin: "50% 50%", /*seems to do nothing?*/
      transformStyle: "preserve-3d"

    };

    const outerStyles: CSSProperties = {
      height: cardHeight,
      width: cardWidth,
      transformOrigin: "50% 50%" /*seems to do nothing?*/,
      transformStyle: "preserve-3d",
      position: "absolute",
    };

    return (
      <div
        onAnimationEnd={() => dispatch(handleEndAnimation(id))}
        ref={mockRenderRef}
        style={outerStyles}
        className={className}
      >
        <div style={innerStyles}>
         
          <img
            ref={mockRenderRef}
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
    );
  }
);

export default CardBase;
