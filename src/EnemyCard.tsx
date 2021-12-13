import { CSSProperties, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getSettings } from "./gameSettings/uiSettings";


export interface EnemyCardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  numHandCards: number;
  offsetLeft?: number;
  offsetTop?: number;
  //transitionData: TransitionData | undefined;
  showNotAmongHighlights?: boolean;

}

const EnemyCard = (props: EnemyCardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image } = props;
  const { tableCardzIndex, cardLeftSpread, cardHeight, cardWidth } = dimensions;
  const highlights = useSelector((state: RootState) => state.highlights);
  const highlightTypeIsCard = useSelector((state: RootState) => state.highlightType === "guestCard");
  
  const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === id);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const notAmongHighlights = (highlightTypeIsCard && !highlights.includes(id)) || props.showNotAmongHighlights;

  const settings = getSettings();
  const [rotation, setRotation] = useState(0);
  const [rndOffset, setRndOffset] = useState({x:0, y:0});

  useEffect(() => {
    const rndR = Math.random() - 0.5;
    setRotation(rndR * settings.messiness);
    const rndX = Math.random() - 0.5;
    const rndY = Math.random() - 0.5;
    setRndOffset({x: rndX * settings.messiness, y: rndY * settings.messiness})
  }, [setRotation, setRndOffset, index, settings.messiness]);

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft? + offsetLeft + rndOffset.x : rndOffset.x,
    top: offsetTop? offsetTop + rndOffset.y : rndOffset.y,
    position: "absolute",
    transform: `rotate(${rotation}deg)`,
    transition: "300ms",
    transitionDelay: "150ms",
  };

  return (
    <img
      alt={image}
      src={`./images/${image}.jpg`}
      id={id}
      style={{
        WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
        transition: "box-shadow 180ms",
        ...normalStyles,
      }}
    />
  );
};

export default EnemyCard;