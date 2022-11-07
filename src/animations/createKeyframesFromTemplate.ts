import { css } from "styled-components";

// in msPerPixel
export const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, long: 2 };
export const delay = { veryShort: 200, short: 500, medium: 1000, long: 2000 };

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
  transform: translate(${data.translateX}px, ${data.translateY}px) rotate(${data.rotateX}deg) rotateY(${data.dimensions.rotateY}deg);
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
    from: { xPosition: fromX, yPosition: fromY, dimensions: fromDimensions, rotation: fromRotateX },
  } = data;

  const deltaX = fromX - toX;
  const deltaY = fromY - toY ;

  return { translateX: deltaX, translateY: deltaY, dimensions: fromDimensions, rotateX: fromRotateX };
};

const createFinalKeyframe = (data: CompleteAnimationTemplate): KeyframePartData => {
  const {
    to: { dimensions: toDimensions, rotation: toRotateX },
  } = data;

  return { translateX: 0, translateY: 0, dimensions: toDimensions, rotateX: toRotateX };
};

export const createKeyframesFromTemplate = (data: CompleteAnimationTemplate) : AnimationData => {
  const { extraSteps, mainTransitionDuration } = transitionTypes[data.animationType];
  const transitionDuration = measureDistance(data) * mainTransitionDuration;
  const totalDuration = calculateTotalDuration(transitionDuration, data.delay || 0, extraSteps);
  
  const keyframesString = css`0%{${stringifyDimensions(createInitialKeyframe(data))}}
  ${data.delay ? stringifyKeyframeData(createInitialKeyframe(data), data.delay, totalDuration) : ""}
  100%{${stringifyDimensions(createFinalKeyframe(data))}}`;
  return {cardId: data.to.cardId, keyframesString, totalDuration}
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
