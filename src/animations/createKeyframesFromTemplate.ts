import { css } from "styled-components";

// in msPerPixel
export const transitionDuration = { veryShort: 0.2, short: 0.5, medium: 1, long: 2 };
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
    durationSpeed: transitionDuration.long,
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
class OffsetAndDurationMetaData {
  private finalScreenData: ToOrFromWithScreenData | ViaWithScreenData;
  private transitionSpeed: number;
  private totalDuration?: number;
  private initial: OffsetAndDurationData = unset;
  private delay: OffsetAndDurationData = unset;
  private final: OffsetAndDurationData;
  private intermediateSteps: OffsetAndDurationData[] = [];
  private delayDuration?: number;

  constructor(finalScreenData: ToOrFromWithScreenData | ViaWithScreenData, transitionSpeed: number) {
    this.finalScreenData = finalScreenData;
    this.transitionSpeed = transitionSpeed;
    this.final = { dx: 0, dy: 0, duration: 100 };
  }

  private _setTotalDuration() {
    this.totalDuration =
      this.intermediateSteps.reduce((prev: number, curr: OffsetAndDurationData) => prev + curr.duration, 0) + (this.delayDuration ?? 0);
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

  setInitialAndDelay(from: ToOrFromWithScreenData | ViaWithScreenData, delayDuration?: number) {
    this.initial = this._getOffsetAndDurationData({ start: from, finish: from });
    this.delay = { ...this.initial, duration: delayDuration ?? 0 };
    this.delayDuration = delayDuration;
  }

  _convertToPercent = (duration: number) => (duration / (this.totalDuration ?? 1)) * 100;

  convertAllToPercent() {
    if (this.delay) {
      this._setTotalDuration();
      this.delay.duration = this._convertToPercent(this.delay.duration);
    }
    this.intermediateSteps = this.intermediateSteps.map(e => ({ ...e, duration: this._convertToPercent(e.duration) }));
  }

  setIntermediateSteps = (trSteps: (ToOrFromWithScreenData | ViaWithScreenData)[]) => {
    const lastIndex = trSteps.length - 1;
    this.intermediateSteps = trSteps
      .map((_, index, arr) => {
        if (index === lastIndex) return { duration: 0, dx: 0, dy: 0 };
        const pair: Pair = { start: arr[index], finish: arr[index + 1] };
        return this._getOffsetAndDurationData(pair);
      })
      .slice(0, lastIndex - 1);
  };

  private _getOffsetAndDurationData = (transitionPair: Pair) => {
    const { start, finish } = transitionPair;
    const durationPair = { start, finish };
    const offsetPair = { start, finish: this.finalScreenData };
    const distance = this._getDuration(durationPair);
    const { dx, dy } = this._getOffset(offsetPair);

    return { dx, dy, duration: distance * this.transitionSpeed };
  };

  public getAllOffsetsAndPercents() {
    return {
      initial: this.initial,
      delay: this.delay,
      intermediateSteps: this.intermediateSteps,
      final: this.final,
      totalDuration: this.totalDuration ?? 0,
    };
  }
}
interface OffsetAndDurationData {
  dx: number;
  dy: number;
  duration: number;
}

const getOffsetsAndPercents = (data: CompleteAnimationTemplate) => {
  const { from, intermediateSteps, to } = data;

  const transitionSpeed = transitionTypes[data.animationType].durationSpeed;

  const offsetAndDurationCalculator = new OffsetAndDurationMetaData(to, transitionSpeed);
  const trSteps = [from, ...intermediateSteps, to];

  offsetAndDurationCalculator.setInitialAndDelay(from, data.delay);
  offsetAndDurationCalculator.setIntermediateSteps(trSteps);
  offsetAndDurationCalculator.convertAllToPercent();

  return offsetAndDurationCalculator.getAllOffsetsAndPercents();
};

export const createKeyframesFromTemplate = (data: CompleteAnimationTemplate): AnimationData => {
  const { from, to } = data;
  const { initial, delay, intermediateSteps, final, totalDuration } = getOffsetsAndPercents(data);

  const keyframesString = css`
    0% {
      ${stringifyDimensions({ ...initial, dimensions: from.dimensions })}
    }
    ${delay.duration}% {
      ${stringifyDimensions({ ...delay, dimensions: from.dimensions })}
    }
    ${intermediateSteps.map(
      step => `${step.duration}% {
      ${stringifyDimensions({ ...step, dimensions: to.dimensions })}
    }`
    )}
    100% {
      ${stringifyDimensions({ ...final, dimensions: to.dimensions })}
    }
  `;

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
