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

class transitionType {
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

const stringifyDimensions = (data: KeyframeStepData) => `
  height: ${data.dimensions.cardHeight};
  width: ${data.dimensions.cardWidth};
  transform: rotate(${data.rotateX}deg) rotateY(${data.dimensions.rotateY}deg) scale(${data.dimensions.scale});
`;

const calculateTotalDuration = (transitionDuration: number, wait: number, extraSteps: Step[]) =>
  wait + transitionDuration + extraSteps.reduce((prev: number, curr: Step) => prev + curr.duration, 0);

const createStart = (data: CompleteAnimationTemplate) => {
  const {
    to: { xPosition: toX, yPosition: toY, dimensions: toDimensions, rotation: toRotateX },
    from: { xPosition: fromX, yPosition: fromY, dimensions: fromDimensions, rotation: fromRotateX },
    animation,
  } = data;
  // TODO make animation property non-optional and call it animationType (transitionType?)
  const { mainTransitionDuration, extraSteps } = transitionTypes[animation || ""];
  // WAIT extra steps therefore need a duration themselves
  const totalDuration = calculateTotalDuration(mainTransitionDuration, data.delay || 0, extraSteps);
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const fromKeyFrameData: KeyframeStepData = { translateX: deltaX, translateY: deltaY, dimensions: fromDimensions, rotateX: fromRotateX };
  const toKeyFrameData: KeyframeStepData = { translateX: 0, translateY: 0, dimensions: toDimensions, rotateX: toRotateX };

  const start = createKeyframe(fromKeyFrameData, 0, totalDuration);
  const wait = data.delay ? createKeyframe(fromKeyFrameData, data.delay, totalDuration) : "";
  const finish = createKeyframe(toKeyFrameData, totalDuration, totalDuration);
};

const createKeyframe = (data: KeyframeStepData, duration: number, totalDuration: number) => {
  const percent = (totalDuration / duration) * 100;
  return wrapWithPercent(percent, stringifyDimensions(data));
};

interface KeyframeStepData {
  translateX: number;
  translateY: number;
  dimensions: AllDimensions;
  rotateX: number;
  // rotateZ: number;
}

const show = (img: string) => `content: url("${img}");`;

// TODO change cardrotation formula to global
interface Step {
  duration: number;
  dimensions: AllDimensions;
  translateX: number;
  translateY: number;
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
