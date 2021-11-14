import React, { CSSProperties, ForwardedRef, forwardRef, useState } from "react";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: CardDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  cardGroupIndex: number;
}


const Card = (props:CardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image, } = props;

  const [rotation, setRotation] = useState(0);

  React.useEffect(() => {
    const rnd = Math.random() - 0.5;
    setRotation(rnd * 3);
  }, [setRotation, index]);


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

  return (
    <img
      alt={image}
      src={`./images/${image}.jpg`}
      id={id}
      style={{
        ...normalStyles,
      }}
    />
  );
}
export default Card;
