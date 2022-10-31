import { CSSProperties, FC, ForwardedRef, forwardRef } from "react";
import { useDispatch } from "react-redux";
import handleEndAnimation from "../animations/handleEndAnimation";

interface CardBaseProps {
  id: string;
  image: string;
  dimensions: AllDimensions;
  children: React.ReactNode;
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

    const normalStyles: CSSProperties = {
      zIndex: tableCardzIndex,
      width: cardWidth,
      height: cardHeight,
      left: offsetLeft || 0,
      top: offsetTop || 0,
      position: "absolute",
      transform: `rotate(${rotateX}deg) rotate3d(0, 1, 0, ${facing === "front" ? 0 : 180})`,
      transition: "300ms",
      userSelect: "none",
    };

    return (
      <img
        ref={mockRenderRef}
        alt={image}
        draggable="false"
        src={facing === "front" ? `./images/${image}.jpg` : "./images/back.jpg"}
        id={id}
        style={{
          WebkitFilter: greyedOut ? "grayscale(100%)" : "",
          boxShadow: "2px 2px 2px black",
          transition: "box-shadow 180ms",
          ...normalStyles,
        }}
        onAnimationEnd={() => dispatch(handleEndAnimation(id))}
        className={className}
      >
        {children}
      </img>
    );
  }
);

export default CardBase;
