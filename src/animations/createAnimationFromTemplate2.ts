import { keyframes } from "styled-components";

// in msPerPixel
const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, long: 2 };
const handToTableDuration = transitionDuration.medium;

interface TransitionTypeData {
  // msPerPixel
  mainTransitionDuration: number;
  extraSteps: Step[];
}

const transitionTypes: { [key in AnimationType]: TransitionTypeData } = {
  handToTable: {
    mainTransitionDuration: transitionDuration.long,
    extraSteps: [],
  },
  deckToHand: {
    mainTransitionDuration: transitionDuration.long,
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
  transform: rotate(${data.rotateX}deg) rotateY(${data.dimensions.rotateY}deg) scale(${data.dimensions.scale});
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

  let first = y - b < 0 ? b - y : y - b;
  let second = x - a < 0 ? a - x : x - a;

  console.log(Math.sqrt(second ^ (2 + first)) ^ 2);
  var distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
  console.log(`distance * handToTableDuration ${distance * handToTableDuration}`);
  // return Math.sqrt(second ^ (2 + first) ^ 2);

  return distance;
};

const createInitialKeyframe = (data: CompleteAnimationTemplate): KeyframePartData => {
  const {
    to: { xPosition: toX, yPosition: toY },
    from: { xPosition: fromX, yPosition: fromY, dimensions: fromDimensions, rotation: fromRotateX },
  } = data;

  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  return { translateX: deltaX, translateY: deltaY, dimensions: fromDimensions, rotateX: fromRotateX };
};

const createFinalKeyframe = (data: CompleteAnimationTemplate): KeyframePartData => {
  const {
    to: { dimensions: toDimensions, rotation: toRotateX },
  } = data;

  return { translateX: 0, translateY: 0, dimensions: toDimensions, rotateX: toRotateX };
};

export const createKeyframesFromTemplate = (data: CompleteAnimationTemplate) => {
  const { extraSteps, mainTransitionDuration } = transitionTypes[data.animationType];
  const transitionDuration = measureDistance(data) * mainTransitionDuration;
  const totalDuration = calculateTotalDuration(transitionDuration, data.delay || 0, extraSteps);

  return `0%{${stringifyDimensions(createInitialKeyframe(data))}}
  ${data.delay ? stringifyKeyframeData(createInitialKeyframe(data), data.delay, totalDuration) : ""}
  100%{${stringifyDimensions(createFinalKeyframe(data))}}`;
};

interface KeyframePartData {
  translateX: number;
  translateY: number;
  dimensions: AllDimensions;
  rotateX: number;
}

interface Step {
  duration: number;
  dimensions: AllDimensions;
  translateX: number;
  translateFrom: "origin" | "destination";
}
