import { useRef, useState } from "react";

const useHoverStyles = (dimensions: AllDimensions) => {
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [, setMousePositionFromCenter] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<Hover>("none");
  const [inspectingCenterOffset, setinspectingCenterOffset] = useState({ x: 0, y: 0 });

  const setHoverStyles = () => {
    setHover("shortHover");
    hoverTimerRef.current = setTimeout(() => {
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

  const setMousePosition = (event: React.MouseEvent, boundingBoxLeft: number, boundingBoxTop: number, boundingBoxBottom: number) => {
    const cardCenterX = dimensions.cardWidth / 2 + boundingBoxLeft;
    const cardCenterY = dimensions.cardHeight / 2 + boundingBoxTop;

    let deltaX = event.pageX - cardCenterX;
    let deltaY = event.pageY - cardCenterY;
    const scale = 1;
    const windowHeight = window.innerHeight;
    const lowerbound = (dimensions.cardHeight + deltaY) * scale + boundingBoxBottom;
    const upperbound = deltaY - boundingBoxTop;
    if (lowerbound > windowHeight) {
      deltaY = windowHeight - dimensions.cardHeight * scale * 0.7 - boundingBoxBottom;
    }
    if (upperbound < 0) {
      deltaY =  0;
    }

    setMousePositionFromCenter({ x: deltaX, y: deltaY });
  };
  const [featuredCardOffset, setFeaturedCardOffset] = useState({ x: 0, y: 0 });

  return { hover, setHoverStyles, clearHoverStyles, setMousePosition, inspectingCenterOffset, featuredCardOffset, setFeaturedCardOffset };
};

export default useHoverStyles;
