// in msPerPixel
export const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, mediumLong: 1.5, long: 2 };
export const delay = { veryShort: 200, short: 500, medium: 1000, long: 2000 };

const handToTableDuration = transitionDuration.medium;

interface TransitionTypeData {
  // msPerPixel
  durationSpeed: number;
  extraSteps: Step[];
}

const transitionTypes: { [key in AnimationType]: TransitionTypeData } = {
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

const stringifyDimensions = (data: KeyframePartData) => `
  height: ${data.dimensions.cardHeight}px;
  width: ${data.dimensions.cardWidth}px;
  transform: translate(${data.dx}px, ${data.dy}px) rotate(${data.dimensions.rotateX}deg) rotateY(${data.dimensions.rotateY}deg) scale(${data.dimensions.scale});
`;

interface Pair {
  start: ToOrFromWithScreenData | ViaWithScreenData;
  finish: ToOrFromWithScreenData | ViaWithScreenData;
}

const unset = { dx: 0, dy: 0, duration: 0 };
class AnimationBuilder {
  private finalScreenData: ToOrFromWithScreenData | ViaWithScreenData;
  private transitionSpeed: number;
  private totalDuration?: number;
  private delay: OffsetAndDurationData = unset;
  private animationSteps: OffsetAndDurationData[] = [];
  private delayDuration?: number;

  constructor(finalScreenData: ToOrFromWithScreenData | ViaWithScreenData, transitionSpeed: number) {
    this.finalScreenData = finalScreenData;
    this.transitionSpeed = transitionSpeed;
  }

  private _setTotalDuration() {
    this.totalDuration =
      this.animationSteps.reduce((prev: number, curr: OffsetAndDurationData) => prev + curr.duration, 0) + (this.delayDuration ?? 0);
  }

  private _getDuration = (pair: Pair) => this._getDistance(pair) * this.transitionSpeed;

  private _getDistance = (pair: Pair) => {
    const { start, finish } = pair;
    const a = start.dx;
    const b = finish.dx;
    const x = start.dy;
    const y = finish.dy;

    var distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
    return distance;
  };

  private _getOffset = (pair: Pair) => {
    const { start, finish } = pair;
    return { dx: start.dx - finish.dx, dy: start.dy - finish.dy };
  };

  setDelayDuration(delayDuration?: number) {
    this.delayDuration = delayDuration;
  }

  _convertToPercent = (duration: number) => (duration / (this.totalDuration ?? 1)) * 100;

  _getAccumulatedDurations = (arr: OffsetAndDurationData[]) => arr.reduce((acc, curr) => acc + curr.duration, 0);

  setAnimationSteps = (trSteps: (ToOrFromWithScreenData | ViaWithScreenData)[]) => {
    const lastIndex = trSteps.length - 1;
    this.animationSteps = trSteps.map((_, index, arr) => {
      if (index === lastIndex) return { duration: 0, dx: 0, dy: 0 };
      const pair: Pair = { start: arr[index], finish: arr[index + 1] };
      return this._getOffsetAndDurationData(pair);
    });
  };

  convertAllToPercent() {
    if (this.delay) {
      this._setTotalDuration();
    }
    const delayStep = { ...this.animationSteps[0], duration: this.delayDuration ?? 0 };
    this.animationSteps.unshift(delayStep);

    this.animationSteps = this.animationSteps.map(e => ({ ...e, duration: this._convertToPercent(e.duration) }));
    let accumulatedDuration = 0;
    const stepsWithPercent = [];
    for (let data of this.animationSteps) {
      stepsWithPercent.push({ ...data, duration: accumulatedDuration });
      accumulatedDuration += data.duration;
    }
    this.animationSteps = stepsWithPercent;
  }

  private _getOffsetAndDurationData = (transitionPair: Pair) => {
    const { start, finish } = transitionPair;
    const durationPair = { start, finish };
    const offsetPair = { start, finish: this.finalScreenData };
    const distance = this._getDuration(durationPair);
    const { dx, dy } = this._getOffset(offsetPair);

    return { dx, dy, duration: distance * this.transitionSpeed };
  };

  public getTotalDurationAndSteps() {
    return {
      steps: this.animationSteps,
      totalDuration: this.totalDuration ?? 0,
    };
  }
}
interface OffsetAndDurationData {
  dx: number;
  dy: number;
  duration: number;
}

const buildAnimation = (data: CompleteAnimationTemplate) => {
  const { from, intermediateSteps, to } = data;

  const transitionSpeed = transitionTypes[data.animationType].durationSpeed;
  const animationBuilder = new AnimationBuilder(to, transitionSpeed);

  animationBuilder.setDelayDuration(data.delay);
  animationBuilder.setAnimationSteps([from, ...intermediateSteps, to]);
  animationBuilder.convertAllToPercent();
  return animationBuilder.getTotalDurationAndSteps();
  
};

export const createKeyframesFromTemplate = (data: CompleteAnimationTemplate): AnimationData => {
  const { from, to } = data;
  const { steps, totalDuration } = buildAnimation(data);

  // TODO: need a more flexible way to set whether from or to dimensions
  const keyframesString = steps.map(
    (step, i) => `${step.duration}% {
    ${stringifyDimensions({ ...step, dimensions: i === steps.length - 1 ? to.dimensions : from.dimensions })}
  }`
  );

  return { cardId: data.cardId, keyframesString, totalDuration };
};

interface KeyframePartData {
  dx: number;
  dy: number;
  dimensions: CardAnimationDimensions;
}

interface KeyframePartData2 {
  offset: { dx: number; dy: number };
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
  dx?: number;
  dy?: number;
  scale?: number;
}
interface Step {
  duration: number;
  dimensions: CardAnimationDimensions;
  dx: number;
  dy: number;
  translateFrom: "origin" | "destination";
}
