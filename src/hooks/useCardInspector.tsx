import { useRef, useState } from "react";

const useHoverStyles = (dimensions: CardDimensions) => {
  const myRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [, setMousePositionFromCenter] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<Hover>("none");
  const [inspectingCenterOffset, setinspectingCenterOffset] = useState({ x: 0, y: 0 });

  const setHoverStyles = () => {
    setHover("shortHover");
    hoverTimerRef.current = setTimeout(() => {
      console.log("set to longhover");
      setHover("longHover");
      setMousePositionFromCenter(mousePositionFromCenter => {
        setinspectingCenterOffset(mousePositionFromCenter);
        return mousePositionFromCenter;
      });
    }, 1000);
  };

  const clearHoverStyles = () => {
    setHover("none");
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const setMousePosition = (event: React.MouseEvent, boundingBoxLeft: number, boundingBoxTop: number) => {
    // const element = myRef.current;
    // if (element) {
    //   const { left: boundingBoxLeft, top: boundingBoxTop } = element.getBoundingClientRect();

    const cardCenterX = dimensions.cardWidth / 2 + boundingBoxLeft;
    const cardCenterY = dimensions.cardHeight / 2 + boundingBoxTop;

    let deltaX = event.pageX -cardCenterX  ;
    let deltaY = event.pageY -cardCenterY;
    const scale = 1;
    const windowHeight = window.outerHeight;
    const lowerbound = (dimensions.cardHeight + deltaY) * scale + boundingBoxTop;
    if (lowerbound > windowHeight) {
      console.log("too big");
      deltaY = windowHeight - (dimensions.cardHeight * scale) - boundingBoxTop;
      //console.log(deltaY)
    }
    setMousePositionFromCenter({ x: deltaX, y: deltaY });
    // }
  };

  return { hover, setHoverStyles, clearHoverStyles, setMousePosition, inspectingCenterOffset };
};

export default useHoverStyles;
