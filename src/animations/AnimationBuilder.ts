import { transitionMetadata } from "./TransitionMetaData";

interface Pair {
  start: ToOrFromWithScreenData | ViaWithScreenData;
  finish: ToOrFromWithScreenData | ViaWithScreenData;
}

interface KeyframePartData {
  dx: number;
  dy: number;
  dimensions: CardAnimationDimensions;
}

interface OffsetDurationDimensions {
  dx: number;
  dy: number;
  duration: number;
  dimensions: CardAnimationDimensions;
}

const unset: OffsetDurationDimensions = {
  dx: 0,
  dy: 0,
  duration: 0,
  dimensions: {
    cardHeight: 0,
    cardWidth: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 0,
  },
};

export class AnimationBuilder {
  private finalScreenData: ToOrFromWithScreenData | ViaWithScreenData;
  private transitionSpeed: number;
  public totalDuration?: number;
  private delay: OffsetDurationDimensions = unset;
  private animationSteps: OffsetDurationDimensions[] = [];
  public delayDuration?: number;
  public cardId = "";
  public keyframesString?: string;

  constructor(data: CompleteAnimationTemplate) {
    const { from, intermediateSteps, to, animationType } = data;

    this.finalScreenData = to;
    this.transitionSpeed = transitionMetadata[animationType].durationSpeed;
    const trSteps = intermediateSteps ? [from, ...intermediateSteps, to] : [from, to];

    this._setCardId(data.cardId);
    this._setDelayDuration(data.delay);
    this._setAnimationSteps(trSteps);
    this._convertAllToPercent();
    this._createKeyframesFromTemplate();
  }

  private _stringifyDimensions = (data: KeyframePartData) => `
  height: ${data.dimensions.cardHeight}px;
  width: ${data.dimensions.cardWidth}px;
  transform: translate(${data.dx}px, ${data.dy}px) rotate(${data.dimensions.rotateX}deg) rotateY(${data.dimensions.rotateY}deg) scale(${data.dimensions.scale});
`;

  private _setTotalDuration() {
    this.totalDuration =
      this.animationSteps.reduce((prev: number, curr: OffsetDurationDimensions) => prev + curr.duration, 0) + (this.delayDuration ?? 0);
  }

  private _setCardId = (id: string) => (this.cardId = id);

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

  private _setDelayDuration(delayDuration?: number) {
    this.delayDuration = delayDuration;
  }

  private _convertToPercent = (duration: number) => (duration / (this.totalDuration ?? 1)) * 100;

  private _setAnimationSteps = (trSteps: (ToOrFromWithScreenData | ViaWithScreenData)[]) => {
    const lastIndex = trSteps.length - 1;
    this.animationSteps = trSteps.map((step, index, arr) => {
      if (index === lastIndex) return { duration: 0, dx: 0, dy: 0, dimensions: step.dimensions };
      const pair: Pair = { start: arr[index], finish: arr[index + 1] };
      return this._getOffsetDurationDimensions(pair, step.dimensions);
    });
  };

  private _convertAllToPercent() {
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

  private _getOffsetDurationDimensions = (transitionPair: Pair, dimensions: CardAnimationDimensions) => {
    const { start, finish } = transitionPair;
    const durationPair = { start, finish };
    const offsetPair = { start, finish: this.finalScreenData };
    const distance = this._getDuration(durationPair);
    const { dx, dy } = this._getOffset(offsetPair);

    return { dx, dy, duration: distance * this.transitionSpeed, dimensions };
  };

  private _createKeyframesFromTemplate = () => {
    const steps = this.animationSteps;

    // TODO: need a more flexible way to set whether from or to dimensions
    this.keyframesString = steps
      .map(
        step => `${Math.floor(step.duration)}% {
      ${this._stringifyDimensions(step)}
    }`
      )
      .join(" ");
  };

  public getAnimationData = (): AnimationData => ({
    keyframesString: this.keyframesString,
    totalDuration: this.totalDuration ?? 0,
    cardId: this.cardId,
  });
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
