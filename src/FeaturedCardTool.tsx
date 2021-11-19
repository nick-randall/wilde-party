import { render } from "@testing-library/react";
import { ForwardedRef, forwardRef, useRef, useState } from "react";
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
  render: () => JSX.Element;
}

const FeaturedCardBox = (props: FeaturedCardBoxProps) => {
  const { dimensions, translateX, translateY } = props;
  const { cardHeight, cardWidth, featuredCardScale } = dimensions;
  return (
    <div
      style={{
        border: "thin black solid",
        height: cardHeight,
        width: cardWidth,
        transform: `scale(${featuredCardScale}) translateX(${translateX}) translateY(${translateY})`,
      }}
    />
  );
};

const FeaturedCardTool = (props: FeaturedCardProps) => {
  const {dimensions} =  props ;
  const { cardHeight, cardWidth, featuredCardScale } = dimensions;
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const myRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
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
      }}
    >
      <FeaturedCardBox {...props} translateX={translate.x} translateY={translate.y} />
      {//render()
      }
    </div>
  );
};

export default FeaturedCardTool;