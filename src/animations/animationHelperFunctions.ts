import { dimensionConstants } from "../helperFunctions/getCardStyles";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";
import { Offset } from "./getOffset";
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
    "-moz-transform-style": string;
    "-webkit-transform-style": string;
    "border-radius": string;
}

const middleCardWidth = 200;
const middleCardHeight = 1.5416238438 * middleCardWidth;

export const getMiddleOffset = (): Offset => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    return new Offset({
        dx: screenWidth / 2 - middleCardWidth / 2,
        dy: screenHeight / 2 - middleCardHeight / 2,
    });
};

export const getOffsetOf = (el: HTMLElement | null): Offset => {
    if (el) {
        const { x, y } = el.getBoundingClientRect();
        return new Offset({ dx: x, dy: y });
    }
    throw new Error("Element not found!");
    // return new Offset({ dx: 0, dy: 0 });
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

export const getPlayerHandOffset = (numCards: number) => {
    const halfOffset = numCards / 2;
    const offset = dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD * halfOffset;
    return offset;
    return 0;
};

export const getCardName = (card: GameCard) => {
    const re = /[a-z_]+/;
    const result = re.exec(card.imageName);
    if (result) {
        return result[0];
    }
    return "";

}

export const getCardGroupId = (cardGroup: NewCardGroupObj) => {
    return cardGroup.cards[0].id + 100000;
}