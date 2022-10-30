import { keyframes } from "styled-components";

const transitionDuration = { veryShort: 200, short: 500, medium: 1000, long: 2000 };
const handToTableDuration = transitionDuration.medium;

// const handToTable = (template: CompleteAnimationTemplate) => {
//   const {
//     to: { dimensions: finalDimensions },
//     from: { dimensions: initialDimension },
//     animation,
//     delay,
//   } = template;
//   return { start: { dime } };
// };

const wrapWithPercent = (percent: number, keyframeData: string) => `${percent}%{${keyframeData}};`

const stringifyDimensions = (data: KeyframeStepData) => `
  height: ${data.dimensions.cardHeight};
  width: ${data.dimensions.cardWidth};
  transform: rotate(${data.rotateX}deg) rotate3d(0, 1, 0, ${data.rotateZ}deg) scale(${data.dimensions.scale});
`;

const createKeyframe = (data: KeyframeStepData, duration: number, totalDuration: number) => {
  const percent = (totalDuration / duration) * 100;
  return wrapWithPercent(percent, stringifyDimensions(data));
}

interface KeyframeStepData {
  translateX: number;
  translateY: number;
  dimensions: AllDimensions;
  rotateX: number;
  rotateZ: number;
}



const showFront = (frontImgSrc: string) => `
  content: url("${frontImgSrc}");
`;
const showBack = (backImgSrc: string) => `
  content: url("${backImgSrc}");
`;

const show = (img: string) => `content: url("${img}");`;

// TODO change cardrotation formula to global
interface Step {
  duration: number;
  dimensions: AllDimensions;
  translateX: number;
  translateY: number;
  translateFrom: "origin" | "destination";
  show: "front" | "back";
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
