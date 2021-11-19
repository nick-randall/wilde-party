import React, { CSSProperties, useRef, useState } from "react";
import { getSettings } from "./gameSettings/uiSettings";
import useHoverStyles from "./hooks/useCardInspector";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  cardGroupIndex: number;
}

const Card = (props: CardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image } = props;
  const { tableCardzIndex } = dimensions;
  const { setMousePosition, setHoverStyles, clearHoverStyles, hover, inspectingCenterOffset } = useHoverStyles(dimensions);
  const settings = getSettings();
  const cardRef = useRef<HTMLImageElement>(null);


  const [rotation, setRotation] = useState(0);

  React.useEffect(() => {
    const rnd = Math.random() - 0.5;
    setRotation(rnd * settings.messiness);
  }, [setRotation, index, settings.messiness]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const element = cardRef.current;
    if (element) {
      const { left: boundingBoxLeft, top: boundingBoxTop, bottom: boundingBoxBottom } = element.getBoundingClientRect();
      setMousePosition(event, boundingBoxLeft, boundingBoxTop, boundingBoxBottom);
    }
  };

  const normalStyles: CSSProperties = {
    zIndex: dimensions.tableCardzIndex,
    width: dimensions.cardWidth,
    height: dimensions.cardHeight,
    left: offsetLeft || "",
    top: offsetTop || "",
    // left: index * dimensions.cardLeftSpread + dimensions.leftOffset,
    // top: index * dimensions.cardTopSpread,
    position: "absolute",
    transform: `rotate(${rotation}deg)`,
    //transition: "left 250ms ease",
    // pointerEvents:
    //   legalTargetStatus === "notAmongLegalTargets" || legalTargetStatus === "placeIsLegalTarget" || legalTargetStatus === "placeIsRearranging"
    //     ? "none"
    //     : "auto",
  };

  const hoverStyles = {
    longHover: {
      transform: `scale(2) translateX(${inspectingCenterOffset.x}px) translateY(${inspectingCenterOffset.y}px)`,
      transition: "transform 800ms",
      zIndex: tableCardzIndex + 1,
      //  left: 125 * (index - (numHandCards / 2 - 0.5)),
    },
    shortHover: {
    },
    none: {},
  };

  return (
    <img
      alt={image}
      ref={cardRef}
      src={`./images/${image}.jpg`}
      onMouseMove={handleMouseMove}
      onMouseEnter={setHoverStyles}
      onMouseLeave={clearHoverStyles}
      id={id}
      style={{
        ...normalStyles,
        ...hoverStyles[hover]
      }}
    />
  );
};
export default Card;
