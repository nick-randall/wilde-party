
import React, { CSSProperties, useRef, useState } from "react";
import { rotate } from "./helperFunctions/equations";

interface CardInspectorProps {
  dimensions: AllDimensions;
  cardRotation: number;
  render: (ref: React.Ref<HTMLImageElement>, handleClick: (event: React.MouseEvent) => void, handleMouseLeave: () => void, style: CSSProperties)=>JSX.Element
}

export const CardInspector = (props: CardInspectorProps) => {
  const { dimensions, cardRotation } = props;
  const { cardHeight, cardWidth, scale } = dimensions;

  const [isInspected, setIsInspected] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLImageElement>(null);

  const handleClick = (event: React.MouseEvent) => {
    if (isInspected) {
      setIsInspected(false);
      return;
    }
    const element = cardRef.current;
    if (element) {
      const { left: boundingBoxLeft, top: boundingBoxTop, bottom: boundingBoxBottom, width, height } = element.getBoundingClientRect();

      const clicked = { x: event.pageX - boundingBoxLeft, y: event.pageY - boundingBoxTop };
      
      // Difference in dimensions of the card (cardWidth,cardHeight) to the Bounding Box
      // allows me to measure from top left corner of card instead of from top left corner of Bounding Box
      const offset = { x: (width - cardWidth) / 2, y: (height - cardHeight) / 2 };

      //  A<->B
      //  -------------|
      //  |  \-----\   |
      //  |   \     \  | X
      //  |    \-----\ | |
      //  |------------| Y
      let adjusted: { [prop: string]: { x: number; y: number } | number } = {};
      adjusted.center = { x: cardWidth / 2, y: cardHeight / 2 };
      adjusted.clicked = {
        x: clicked.x - offset.x,
        y: clicked.y - offset.y,
      };
      adjusted.top = boundingBoxTop - offset.y;
      adjusted.bottom = boundingBoxBottom - offset.y;

      const rotatedAdjustedClicked: { x: number; y: number } = rotate(
        adjusted.center.x,
        adjusted.center.y,
        adjusted.clicked.x,
        adjusted.clicked.y,
        cardRotation
      );

      let delta = { x: rotatedAdjustedClicked.x - adjusted.center.x, y: rotatedAdjustedClicked.y - adjusted.center.y };

      const newTop = adjusted.top - cardHeight / 2 + delta.y;
      const newBottom2 = adjusted.bottom + cardHeight / 2 + delta.y; //+ off
      const margin = 20;
      const screenbottom = window.innerHeight - margin;
      if (newBottom2 > screenbottom) {
        const diff = newBottom2 - screenbottom;
        delta = { x: delta.x, y: delta.y - diff };
      }
      const scaledDelta = { x: delta.x / scale, y: delta.y / scale };

      setTranslate(scaledDelta);
      setIsInspected(true);
    }
  };

  const handleMouseLeave = ()=> setIsInspected(false);

  const inspectedStyle = isInspected
    ? {
        transform: `scale(${scale}) translateX(${translate.x}px) translateY(${translate.y}px)`,
        zIndex: 15,
      }
    : {};

      return <div>{props.render(cardRef, handleClick, handleMouseLeave, inspectedStyle)}</div>

};
