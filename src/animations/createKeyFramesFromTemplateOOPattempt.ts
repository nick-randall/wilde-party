import { css } from "styled-components";

// in msPerPixel
export const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, long: 2 };
export const delay = { veryShort: 200, short: 500, medium: 1000, long: 2000 };

const handToTableDuration = transitionDuration.medium;

interface AnimationTypeData {
  // msPerPixel
  mainTransitionDuration: number;
  secondTransitionDuration?: number;
  extraSteps: Step[];
  // delayBetweenInstances
  // eg. delay between dealing a card
}

const transitionTypes: { [key in AnimationType]: AnimationTypeData } = {
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
  height: ${data.dimensions.cardHeight}px;
  width: ${data.dimensions.cardWidth}px;
  transform: translate(${data.translateX}px, ${data.translateY}px) rotate(${data.dimensions.rotateX}deg) rotateY(${data.dimensions.rotateY}deg) scale(${data.dimensions.scale});
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

const measureDistances = (data: CompleteAnimationTemplate) => {
  if (data.via) {
    const {
      to: { xPosition: toX, yPosition: toY },
      from: { xPosition: fromX, yPosition: fromY },
      via: { xPosition: viaX, yPosition: viaY },
    } = data;

    const a1 = toX;
    const b1 = toY;
    const x1 = viaX;
    const y1 = viaY;

    const a2 = viaX;
    const b2 = viaY;
    const x2 = fromX;
    const y2 = fromY;

    var distance1 = Math.sqrt(Math.pow(x1 - a1, 2) + Math.pow(y1 - b1, 2));
    var distance2 = Math.sqrt(Math.pow(x2 - a2, 2) + Math.pow(y2 - b2, 2));

    return { distance1, distance2 };
  }
  return { distance1: 0, distance2: 0 };
};

const createInitialKeyframe = (data: CompleteAnimationTemplate): KeyframePartData => {
  const to = data.via || data.from;
  const from = data.from;
  const { xPosition: toX, yPosition: toY } = to;
  const { xPosition: fromX, yPosition: fromY, dimensions: fromDimensions } = from;

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

export const createKeyframesWithViaFromTemplate = (data: CompleteAnimationTemplate): AnimationData => {
  const { extraSteps, mainTransitionDuration } = transitionTypes[data.animationType];
  const { distance1, distance2 } = measureDistances(data);
  const durations = [0, data.delay ?? 0, distance1 * mainTransitionDuration, distance2 * mainTransitionDuration, ...extraSteps.map(a => a.duration)];
  // const totalDuration = Object.values(durations).reduce((prev, acc) => prev + acc); //calculateTotalDuration(transitionDuration, data.delay || 0, extraSteps);
  const totalDuration = durations.reduce((prev, acc) => prev + acc);

  const keyframesString = css`
    0% {
      ${stringifyDimensions(createInitialKeyframe(data))}
    }
    ${data.delay ? stringifyKeyframeData(createInitialKeyframe(data), data.delay, totalDuration) : ""}
    100% {
      ${stringifyDimensions(createFinalKeyframe(data))}
    }
  `;
  return { cardId: data.to.cardId, keyframesString, totalDuration };
};

interface KeyframePartData {
  translateX: number;
  translateY: number;
  dimensions: CardAnimationDimensions;
  // duration: number;
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

type AnimationBuilderStepType = "initial" | "delay" | "from" | "to" | "final";

interface AnimationBuilderStep {
  xPosition: number;
  yPosition: number;
  dimensions: CardAnimationDimensions;
  duration: number;
  type: AnimationBuilderStepType;
}

class AnimationBuilder {
  private animationTypeData: AnimationTypeData;
  private animationSteps: AnimationBuilderStep[] = [];
  private totalDuration?: number;
  private mainTransitionDistance?: number;
  private secondTransitionDistance?: number;

  public addAnimationStep(animationStep: AnimationBuilderStep) {
    this.animationSteps.push(animationStep);
  }
  constructor(animationType: AnimationType) {
    this.animationTypeData = transitionTypes[animationType];
  }

  private distanceFormula = (from: { xPosition: number; yPosition: number }, to: { xPosition: number; yPosition: number }) => {
    const { xPosition: a, yPosition: b } = from;
    const { xPosition: x, yPosition: y } = to;

    return Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
  };

  private measureDistance = () => {
    const from = this.animationSteps.find(e => e.type === "from");
    const via = this.animationSteps.find(e => e.type === "to");
    const final = this.animationSteps.find(e => e.type === "final");
    if (!via && from && final) {
      this.mainTransitionDistance = this.distanceFormula(final, from);
    } else if (via && from && final) {
      this.mainTransitionDistance = this.distanceFormula(via, from);
      this.secondTransitionDistance = this.distanceFormula(final, via);
    }
  };

  private calculateTotalDuration = () =>
    (this.totalDuration = this.animationSteps.reduce((prev: number, curr: AnimationBuilderStep) => prev + curr.duration, 0));

  private convertDurationsToPercent = () =>
    this.animationSteps.forEach(step => {
      if (this.totalDuration) step.duration = (step.duration / this.totalDuration) * 100;
    });

  public build() {}
}

const builder = new AnimationBuilder("deckToHand");
const finalAnimBuildStep = (test: CompleteAnimationTemplate): AnimationBuilderStep => ({
  type: "initial",
  xPosition: test.from.xPosition,
  yPosition: test.from.yPosition,
  dimensions: test.from.dimensions,
  duration: 10,
});
const initialAnimBuildStep = (test: CompleteAnimationTemplate): AnimationBuilderStep => ({
  type: "final",
  xPosition: test.to.xPosition,
  yPosition: test.to.yPosition,
  dimensions: { scale: 1, rotateX: 0, cardHeight: 100, cardWidth: 100, rotateY: 0 },
  duration: 10,
});
// builder.addAnimationStep(initialAnimBuildStep(x));
