import { CardCSSMap } from "./animationHelperFunctions";
import { dimensionConstants } from "../helperFunctions/getCardStyles";

const middleCardWidth = 200;
const middleCardHeight = 1.5416238438 * middleCardWidth;

export const getMiddleOffset = (): Offset => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  return new Offset({ dx: screenWidth / 2 - middleCardWidth / 2, dy: screenHeight / 2 - middleCardHeight / 2 });
};

export const getOffsetOf = (el: HTMLElement | null): Offset => {
  if (el) {
    const { x, y } = el.getBoundingClientRect();
    return new Offset({ dx: x, dy: y });
  }
  console.error("Element not found!");
  return new Offset({ dx: 0, dy: 0 });
};

export const getMiddleStyles = (): CardCSSMap => ({
  "z-index": `${dimensionConstants.ANIMATED_CARDS_Z_INDEX}`,
  width: `${middleCardWidth}px`,
  height: `${middleCardHeight}px`,
  left: "0px",
  top: "0px",
  position: "absolute",
  transform: "",
  transition: "",
  "box-shadow": dimensionConstants.MIDDLE_CARD_SHADOW,
  "user-select": "",
  "transform-style": "",
  "-webkit-transform-style": "",
  "-moz-transform-style": "",
  scale: "",
  "border-radius": `${dimensionConstants.CARD_BORDER_RADIUS}`
});

export class Offset {
  dx: number;
  dy: number;
  constructor(args: OffsetArgs) {
    const { dx, dy } = args;
    this.dx = dx;
    this.dy = dy;
  }

  minus(other: Offset) {
    return new Offset({ dx: this.dx - other.dx, dy: this.dy - other.dy });
  }
}