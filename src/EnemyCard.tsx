import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getSettings } from "./gameSettings/uiSettings";
import { Transition, TransitionStatus } from "react-transition-group";


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
  const transitionData = useSelector((state: RootState) => state.transitionData.find(t => t.cardId === id));
  console.log("transitionData")
  const dispatch = useDispatch();
  interface TransitionStyles {
    [status: string]: {};
  }
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
  let transitionStyles: TransitionStyles = 
  transitionData ? 
  
  { 
    entering: {}, entered: {} }:{};
  const getTransition = (state: TransitionStatus) => {
    if (transitionData) {
      const { originDelta, duration, curve, originDimensions, startAnimation, startAnimationDuration } = transitionData;

      if (state === "entering") {
        transitionStyles = {
          transform: `rotate(${originDimensions.rotation(index)}deg) translateX(${originDelta.x}px) translateY(${originDelta.y}px`,
          height: originDimensions.cardHeight,
          width: originDimensions.cardWidth,
          pointerEvents: "none",
        };
      } else if (state === "entered") {
        transitionStyles = {
          transition: `transform ${duration}ms ${curve},  height ${duration}ms ${curve}, width ${duration}ms ${curve}, left ${duration}ms ${curve}, top ${duration}ms ${curve}`,
        };
      }

      return transitionStyles;
    }
  };

  return (
      <Transition
        in={true}timeout={0}
        //timeout={transitionData !== undefined ? transitionData.startAnimationDuration : 0}
        appear={true}
        addEndListener={(node: HTMLElement) => {
          node.addEventListener(
            "transitionend",
            () => 
              dispatch({type:"REMOVE_TRANSITION", payload: id})
            ,
            false
          );
        }}
      >
  {(state)=>
    <img
      alt={image}
      // src={`./images/${image}.jpg`}
      src="./images/back.jpg"
      draggable="false"
      id={id}
      style={{
        WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
        transition: "box-shadow 180ms",
        ...normalStyles,
        ...getTransition(state)
      }}
    />}
    </Transition>
  );
};

export default EnemyCard;