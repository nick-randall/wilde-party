import { transitionDuration } from "./createKeyframesFromTemplate";

interface Step {
  duration: number;
  dimensions: CardAnimationDimensions;
  dx: number;
  dy: number;
  translateFrom: "origin" | "destination";
}

interface TransitionMetaData {
  // msPerPixel
  durationSpeed: number;
  extraSteps: Step[];
}

export const transitionMetadata: { [key in AnimationType]: TransitionMetaData } = {
  handToTable: {
    durationSpeed: transitionDuration.long,
    extraSteps: [],
  },
  deckToHand: {
    durationSpeed: transitionDuration.mediumLong,
    extraSteps: [],
  },
  tableToDiscardPile: {
    durationSpeed: transitionDuration.long,
    extraSteps: [],
  },
};