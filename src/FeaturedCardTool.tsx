import { render } from "@testing-library/react";
import { ForwardedRef, forwardRef, useRef, useState } from "react";
import { dimensionConstants } from "./helperFunctions/getCardStyles";
interface FeaturedCardProps {
  dimensions: CardDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  render: () => JSX.Element;
}

interface FeaturedCardBoxProps {
  translateX: number;
  translateY: number;
  dimensions: CardDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //render: () => JSX.Element;
}

export const FeaturedCardBox = (props: FeaturedCardBoxProps) => {
  const { dimensions, translateX, translateY } = props;
  const { cardHeight, cardWidth } = dimensions;
  const featuredCardScale = dimensionConstants.FEATURED_CARD_SCALE
  return (
    <div
      style={{
        border: "thin black solid",
        height: cardHeight,
        width: cardWidth,
        transform: `scale(${featuredCardScale}) translateX(${translateX}px) translateY(${translateY}px)`,
        position:"absolute",
        pointerEvents: "none"
      }}
    />
  );
};

const FeaturedCardTool = (props: FeaturedCardProps) => {
  const {dimensions} =  props ;
  const { cardHeight, cardWidth } = dimensions;
  const featuredCardScale = dimensionConstants.FEATURED_CARD_SCALE

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const myRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    console.log("s")
    const element = myRef.current;
    if (element) {
      
      const { top, left } = element.getBoundingClientRect();
      setTranslate({ x: event.pageX - left, y: event.pageY - top });
    }
  };

  return (
    <div
      ref={myRef}
      onMouseMove={handleMouseMove}
      style={{
        height: cardHeight,
        width: cardWidth,
        pointerEvents: "auto",
      }}
    >
      <FeaturedCardBox {...props} translateX={translate.x} translateY={translate.y} />
      {//render()
      }
    </div>
  );
};

export default FeaturedCardTool;