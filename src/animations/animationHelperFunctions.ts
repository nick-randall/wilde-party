import { Offset } from "./getOffset";

export const getStylesOf = (card: HTMLElement | null): CardCSSMap => {
  const attrs = ["z-index", "width", "height", "left", "top", "position", "transform", "transition", "box-shadow", "user-select", "transform-style"];
  const map = {} as any;
  if (!card) {
    console.error("Card not found!");
    return map;
  }
  for (const attrName of attrs) {
    const a = attrName as any;
    const attr = card.style[a];
    map[a] = attr;
  }
  return map;
};

export interface CardCSSMap {
  "z-index": string;
  width: string;
  height: string;
  left: string;
  top: string;
  position: "absolute";
  transform: string;
  transition: string;
  scale: string;
  "box-shadow": string;
  "user-select": string;
  "transform-style": string;
  "border-radius": string;
}

export function copyAttrs(target: HTMLElement, source: HTMLElement) {
  const attrs = ["z-index", "width", "height", "left", "top", "position", "transform", "transition", "box-shadow", "user-select", "transform-style"];
  for (const attrName of attrs) {
    const a = attrName as any;
    const attr = source.style[a];
    target.style[a] = attr;
  }
}

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

// export const getMiddleStyles = (): CardCSSMap => ({
//   "z-index": "99",
//   width: `${middleCardWidth}`,
//   height: `${middleCardHeight}`,
//   left: "",
//   top: "",
//   position: "absolute",
//   transform: "",
//   transition: "300ms",
//   "box-shadow": "",
//   "user-select": "",
//   "transform-style": "",
//   scale: "",
//   "border-radius": `${dimensionConstants.CARD_BORDER_RADIUS}`
// });

export interface RefMap {
  [key: number]: HTMLElement | null;
}
