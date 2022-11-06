import { keyframes } from "styled-components";

// in msPerPixel
const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, long: 2 };
const handToTableDuration = transitionDuration.medium;

interface TransitionTypeData {
  // msPerPixel
  mainTransitionDuration: number;
  extraSteps: Step[];
}

const transitionTypes: { [type: string]: TransitionTypeData } = {
  handToTable: {
    mainTransitionDuration: transitionDuration.long,
    extraSteps: [],
  },
};

const extraAnimationSteps: { [type: string]: Step[] } = {
  handToTable: [],
};

class TransitionType {
  name: string;
  mainTransitionDuration: number;
  steps: Step[];

  constructor(name: string, mainTransitionDuration: number, steps: Step[]) {
    this.name = name;
    this.mainTransitionDuration = mainTransitionDuration;
    this.steps = steps;
  }

  getTotalDuration = () => this.mainTransitionDuration + this.steps.reduce((prev: number, curr: Step) => prev + curr.duration, 0);
}

// const handToTable = (template: CompleteAnimationTemplate) => {
//   const {
//     to: { dimensions: finalDimensions },
//     from: { dimensions: initialDimension },
//     animation,
//     delay,
//   } = template;
//   return { start: { dime } };
// };

const wrapWithPercent = (percent: number, keyframeData: string) => `${percent}%{${keyframeData}};`;

const stringifyDimensions = (data: KeyframePartData) => `
  height: ${data.dimensions.cardHeight};
  width: ${data.dimensions.cardWidth};
  transform: rotate(${data.rotateX}deg) rotateY(${data.dimensions.rotateY}deg) scale(${data.dimensions.scale});
`;

const stringifyKeyframe = (data: KeyframePartData, duration: number, totalDuration: number) => {
  const percent = (totalDuration / duration) * 100;
  return wrapWithPercent(percent, stringifyDimensions(data));
};

const calculateTotalDuration = (transitionDuration: number, wait: number, extraSteps: Step[]) =>
  wait + transitionDuration + extraSteps.reduce((prev: number, curr: Step) => prev + curr.duration, 0);


// const dimensionsFromStep = (step: Step): AllDimensions => ({
//   featuredCardScale: 0,
//   tableCardHeight: 0,
//   tableCardWidth: 0,
//   cardLeftSpread: 0,
//   maxCardLeftSpread: 0,
//   cardTopSpread: 0,
//   zIndex: 10,
//   draggedCardScale: 0,
//   draggedCardWidth: 0,
//   draggedCardzIndex: 0,
//   tableCardzIndex: 10,
//   scale: 2,
//   handToTableScaleFactor: 0,
//   ...step.dimensions,
// });

const measureDistance = (data: CompleteAnimationTemplate) => {
  const {
    to: { xPosition: toX, yPosition: toY },
    from: { xPosition: fromX, yPosition: fromY },
  } = data;

  const a = fromX;
  const b = toX;
  const y = fromY;
  const x = toY;

  return Math.sqrt((x - a) ^ (2 + (y - b)) ^ 2);
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

const createKeyframesFromTemplate = (data: CompleteAnimationTemplate) => {
  // TODO make animation property non-optional and call it animationType (transitionType?)
  const { extraSteps, mainTransitionDuration } = transitionTypes[data.animation || ""];
  // WAIT extra steps therefore need a duration themselves
  const transitionDuration = measureDistance(data) * mainTransitionDuration;
  const totalDuration = calculateTotalDuration(transitionDuration, data.delay || 0, extraSteps);

  // const start = stringifyKeyframe(createInitialKeyframe(data), 0, totalDuration);
  // const wait = data.delay ? stringifyKeyframe(createInitialKeyframe(data), data.delay, totalDuration) : "";
  // const finish = stringifyKeyframe(createFinalKeyframe(data), totalDuration, totalDuration);

  // return `${start}
  // ${wait};
  // ${finish}
  // `;

  return `${stringifyKeyframe(createInitialKeyframe(data), 0, totalDuration)}
          ${data.delay ? stringifyKeyframe(createInitialKeyframe(data), data.delay, totalDuration) : ""};
          ${stringifyKeyframe(createFinalKeyframe(data), totalDuration, totalDuration)}
          `;
};


interface KeyframePartData {
  // duration: number;
  translateX: number;
  translateY: number;
  dimensions: AllDimensions;
  rotateX: number;
  // rotateZ: number;
}

interface Step {
  duration: number;
  dimensions: AllDimensions;
  translateX: number;
  translateFrom: "origin" | "destination";
}

// const keyframestest2 = ()

// const keyframestest = (steps: Step[]) => {
//   const totalDuration = 0;
//   return keyframes`

// ${steps.map(step => {
//   let keyFrame: string = "";
//   keyFrame += `${stepDurationAsPercent}%{`
//   keyFrame += stringifyDimensions(step.dimensions);
//   keyFrame += show(step.show == "front" ? frontImgSrc : backImgSrc);
//   return keyFrame;
// })}`;
// };

// const createStart = (data: CompleteAnimationTemplate) => {
//   const {
//     to: { xPosition: toX, yPosition: toY, dimensions: toDimensions, rotation: toRotateX },
//     from: { xPosition: fromX, yPosition: fromY, dimensions: fromDimensions, rotation: fromRotateX },
//     animation,
//   } = data;

//   // TODO make animation property non-optional and call it animationType (transitionType?)
//   const { extraSteps, mainTransitionDuration } = transitionTypes[animation || ""];
//   // WAIT extra steps therefore need a duration themselves
//   const transitionDuration = measureDistance(fromX, toX, fromY, toY) * mainTransitionDuration;
//   const totalDuration = calculateTotalDuration(transitionDuration, data.delay || 0, extraSteps);
//   const deltaX = toX - fromX;
//   const deltaY = toY - fromY;
//   const finalX = 0,
//     finalY = 0;
//   const fromKeyFrameData: KeyframePartData = { translateX: deltaX, translateY: deltaY, dimensions: fromDimensions, rotateX: fromRotateX };
//   const toKeyFrameData: KeyframePartData = { translateX: 0, translateY: 0, dimensions: toDimensions, rotateX: toRotateX };

//   const start = createKeyframe(fromKeyFrameData, 0, totalDuration);
//   const wait = data.delay ? createKeyframe(fromKeyFrameData, data.delay, totalDuration) : "";
//   const finish = createKeyframe(toKeyFrameData, totalDuration, totalDuration);
// };
