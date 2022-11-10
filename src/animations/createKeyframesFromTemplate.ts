import { css } from "styled-components";

// in msPerPixel
export const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, long: 2 };
export const delay = { veryShort: 200, short: 500, medium: 1000, long: 2000 };

const handToTableDuration = transitionDuration.medium;

interface TransitionTypeData {
  // msPerPixel
  mainTransitionDuration: number;
  extraSteps: Step[];
  intermediateStep?: IntermediateStep;
}

const transitionTypes: { [key in AnimationType]: TransitionTypeData } = {
  handToTable: {
    mainTransitionDuration: transitionDuration.long,
    intermediateStep: { progress: 0.5, rotateX: 280 },
    extraSteps: [],
  },
  deckToHand: {
    mainTransitionDuration: transitionDuration.long,
    intermediateStep: { progress: 0.5, rotateY: 0},  

    extraSteps: [],
  },
  tableToDiscardPile: {
    mainTransitionDuration: transitionDuration.long,
    extraSteps: [],
  },
};

const wrapWithPercent = (percent: number, keyframeData: string) => `${percent}%{${keyframeData}}`;

const stringifyDimensions = (data: KeyframePartData) => `
  height: ${data.dimensions.cardHeight};
  width: ${data.dimensions.cardWidth};
  transform: translate(${data.translateX}px, ${data.translateY}px) rotate(${data.dimensions.rotateX}deg) rotateY(${data.dimensions.rotateY}deg);
`;

const stringifyKeyframeData = (data: KeyframePartData, duration: number, totalDuration: number) => {
  const percent = (duration / totalDuration) * 100;
  return wrapWithPercent(percent, stringifyDimensions(data));
};

const calculateTotalDuration = (transitionDuration: number, wait: number, extraSteps: Step[]) =>
  wait + transitionDuration + extraSteps.reduce((prev: number, curr: Step) => prev + curr.duration, 0);

const measureDistance = (data: CompleteAnimationTemplate) => {
  const {
    to: { xPosition: toX, yPosition: toY },
    from: { xPosition: fromX, yPosition: fromY },
  } = data;

  const a = toX;
  const b = toY;
  const x = fromX;
  const y = fromY;

  var distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
  return distance;
};

const createInitialKeyframe = (data: CompleteAnimationTemplate): KeyframePartData => {
  const {
    to: { xPosition: toX, yPosition: toY },
    from: { xPosition: fromX, yPosition: fromY, dimensions: fromDimensions },
  } = data;

  const deltaX = fromX - toX;
  const deltaY = fromY - toY;

  return { translateX: deltaX, translateY: deltaY, dimensions: fromDimensions };
};

const createFinalKeyframe = (data: CompleteAnimationTemplate): KeyframePartData => {
  const {
    to: { dimensions },
  } = data;

  return { translateX: 0, translateY: 0, dimensions };
};

const createKeyframeFromIntermediateStep = (data: CompleteAnimationTemplate, intermediateStep: IntermediateStep): KeyframePartData => {
  // translateY and X will need to be calculated from CompleteAnimationTemplate
  // will have to deal with undefined properties

  // undefined properties will need to be calculated according to difference
  // between beginning and end eg rotateX 0 -> 0.33 -> 1 = 0 -> 30 -> 100
  // therefore 30

  // let { cardHeight } = intermediateStep;
  // if (!cardHeight) {
  //   const changeFactor = data.to.dimensions.cardHeight / data.from.dimensions.cardHeight;
  //   intermediateStep.cardHeight = changeFactor * progress;
  // }
  console.log("in intermediate step")
  const { progress } = intermediateStep;
  const calculatedDimensions = {} as CardAnimationDimensions;
  for (let key of Object.keys(data.to.dimensions) as Array<keyof CardAnimationDimensions>) {
    const value = intermediateStep[key]
    if (value === undefined) {
      const changeFactor =  data.from.dimensions[key] / data.to.dimensions[key];
      console.log(changeFactor * progress * 100)
      calculatedDimensions[key] = changeFactor * progress * 100;
    }
    else{
      calculatedDimensions[key] = value;
    }
  }
  const {
    to: { xPosition: toX, yPosition: toY },
    from: { xPosition: fromX, yPosition: fromY },
  } = data;

  const deltaX = fromX - toX;
  const deltaY = fromY - toY;
  const translateX = intermediateStep.translateX ?? deltaX * progress;
  const translateY = intermediateStep.translateY ?? deltaY * progress;
  console.log(calculatedDimensions)
  console.log(translateY)
  return { translateX, translateY, dimensions: calculatedDimensions };
};

export const createKeyframesFromTemplate = (data: CompleteAnimationTemplate): AnimationData => {
  const { extraSteps, mainTransitionDuration, intermediateStep } = transitionTypes[data.animationType];
  const transitionDuration = measureDistance(data) * mainTransitionDuration;
  const totalDuration = calculateTotalDuration(transitionDuration, data.delay || 0, extraSteps);

  const keyframesString = css`
    0% {
      ${stringifyDimensions(createInitialKeyframe(data))}
    }
    ${data.delay ? stringifyKeyframeData(createInitialKeyframe(data), data.delay, totalDuration) : ""}
    ${intermediateStep ? wrapWithPercent(intermediateStep.progress * 100, stringifyDimensions(createKeyframeFromIntermediateStep(data, intermediateStep))): ""}
    100% {
      ${stringifyDimensions(createFinalKeyframe(data))}
    }
  `;
  console.log(keyframesString)
  return { cardId: data.to.cardId, keyframesString, totalDuration };
};

interface KeyframePartData {
  translateX: number;
  translateY: number;
  dimensions: CardAnimationDimensions;
}

// alternative is to say "progress", meaning that half way between
// one part of the animation and another it should have these values:

// so it takes place on the way, cutting durations in half or 0.25 - 0.75
// This way we could just say, eg rotateY 180 progress 0.5, then the flip
// would occur earlier.
interface IntermediateStep {
  progress: number; // (eg 0.5)
  cardHeight?: number;
  cardWidth?: number;
  rotateX?: number;
  rotateY?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
}
interface Step {
  duration: number;
  dimensions: CardAnimationDimensions;
  translateX: number;
  translateY: number;
  translateFrom: "origin" | "destination";
}
