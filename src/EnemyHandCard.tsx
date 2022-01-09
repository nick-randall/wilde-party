import { CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "./animations/animations.css";
import { CardInspector } from "./renderPropsComponents/CardInspector";
import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";

export interface EnemyHandCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
}

const EnemyHandCard = (props: EnemyHandCardProps) => {
  const { id, index, image, dimensions } = props;

  const { tableCardzIndex, cardWidth, cardTopSpread, rotation, cardHeight } = dimensions;

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,

    //left: - 100 * (index - (numHandCards / 2 - 0.5)),
    top: index * cardTopSpread,
    left: 0,
    position: "absolute",
    transform: `rotate(${rotation(index)}deg)`,
    // transition: `left 250ms, width 180ms, transform 180ms`,
    pointerEvents: "auto",
    boxShadow: "10px 10px 10px black",
  };

  return (
    <div
      // The width of this element determines how far cards
      // move aside and make room in other droppables.
      // When not dragging it has a width of 0, which
      // tucks hand cards together
      style={{ width:  0, position: "relative" }}
    >
      <TransitionHandler
        index={index}
        id={id}
        render={(transitionStyles: CSSProperties) => (
          <img
            alt={image}
            src="./images/back.jpg"
            id={id}
            style={{
              ...normalStyles,
              ...transitionStyles,
            }}
          />
        )}
      />
    </div>
  );
};
export default EnemyHandCard;
