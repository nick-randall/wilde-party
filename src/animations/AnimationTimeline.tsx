import { CardCSSMap } from "./animationHelperFunctions";
import { ActiveAnimation } from "./createAnimations";
import { getMiddleStyles, getMiddleOffset, Offset } from "./getOffset";

interface AnimationTimelineArgs {
  animationTracks: AnimationTrack[];
  startDelay?: number;
  showPrevSnapshot?: number[];
}

export class MyAnimationTimeline {
  animationData: AnimationData[];
  totalDuration: number;
  showPrevSnapshot: number[];
  constructor(args: AnimationTimelineArgs) {
    const { animationTracks, startDelay, showPrevSnapshot = [] } = args;
    this.showPrevSnapshot = showPrevSnapshot;
    const trackLengths = animationTracks.map(track => track.steps.length);
    const trackLengthsAllTheSame = trackLengths.every(length => trackLengths[0] === length);
    if (!trackLengthsAllTheSame) throw Error("NOT all animation tracks are the same length");
    const tracksWithDurations = this.setStepDurations(animationTracks, startDelay);
    let totalDuration = 0;
    const animationDataTracks: AnimationData[] = tracksWithDurations.map(track => {
      const intermediateSteps = track.getIntermediateSteps(track.steps, startDelay);
      totalDuration = intermediateSteps[intermediateSteps.length - 1].accDuration;
      const keyframesString = this.createKeyframesStringFromIntermediateStep(intermediateSteps, totalDuration);

      return {
        keyframesString,
        cardId: track.cardId,
        totalDuration,
        placeId: track.homePlaceId,
        track: "main",
      };
    });
    const opacityAndShadowTracks: AnimationData[] = tracksWithDurations.map(track => {
      const intermediateSteps = track.getIntermediateSteps(track.steps, startDelay);
      totalDuration = intermediateSteps[intermediateSteps.length - 1].accDuration;

      const keyframesString = this.createOpacityAndShadowKeyframes(intermediateSteps, totalDuration);

      return {
        keyframesString,
        cardId: track.cardId,
        totalDuration,
        placeId: track.homePlaceId,
        track: "opacityAndShadow",
      };
    });
    const zIndexTracks: AnimationData[] = tracksWithDurations.map(track => {
      const intermediateSteps = track.getIntermediateSteps(track.steps, startDelay);
      totalDuration = intermediateSteps[intermediateSteps.length - 1].accDuration;

      const keyframesString = this.createZIndexKeyframes(intermediateSteps, totalDuration);

      return {
        keyframesString,
        cardId: track.cardId,
        totalDuration,
        placeId: track.homePlaceId,
        "track": "zIndex",
      };
    });
    this.totalDuration = totalDuration;
    this.animationData = [...animationDataTracks, ...opacityAndShadowTracks, ...zIndexTracks];
  }

  addHideTrack(cardId: number, placeId: number) {
    const keyframesString = `0%{opacity:0} 100%{opacity:0}}`;

    const animation: AnimationData = {
      keyframesString,
      cardId: cardId,
      totalDuration: this.totalDuration,
      placeId: placeId,
      track: "opacityAndShadow",
    };
    this.animationData.push(animation)
  }

  _stringifyDimensions = (data: IntermediateStepData) => {
    return `left: ${data.style.left};
    height: ${data.style.height}; 
    width: ${data.style.width}; 
    transform: translate(${data.offset.dx}px, ${data.offset.dy}px) ${data.style.transform}; 
    transform-style: preserve-3d;
    `;
  };

  _stringifyOpacity = (data: IntermediateStepData) => {
    const opacity = data.visibility === "appearing" || data.visibility === "hidden" ? 0 : 1;
    return `opacity: ${opacity}; 
    box-shadow:${data.style["box-shadow"]}`;
  };

  _stringifyZIndex = (data: IntermediateStepData) => {
    return `z-index: ${data.style["z-index"]};`
  };

  createKeyframesStringFromIntermediateStep = (intermediateStepData: IntermediateStepData[], totalDuration: number) => {
    // const totalDuration = intermediateStepData[intermediateStepData.length - 1].accDuration;
    let keyframes = "";
    for (const data of intermediateStepData) {
      const percent = Math.floor((data.accDuration / totalDuration) * 100);
      const dimensions = this._stringifyDimensions(data);
      const step = `${percent}% {${dimensions}}
`;
      keyframes += step;
      if (data.visibility === "appearing" || data.visibility === "disappearing") {
        const switchStepData: IntermediateStepData = { ...data, visibility: data.visibility === "disappearing" ? "hidden" : "visible" };
        const dimensions = this._stringifyDimensions(switchStepData);
        const switchStep = `${percent + 0.0001}% {${dimensions}}`;
        keyframes += switchStep;
      }
    }
    return keyframes;
  };

  createOpacityAndShadowKeyframes = (intermediateStepData: IntermediateStepData[], totalDuration: number) => {
    // const totalDuration = intermediateStepData[intermediateStepData.length - 1].accDuration;
    let keyframes = "";
    for (const data of intermediateStepData) {
      const percent = Math.floor((data.accDuration / totalDuration) * 100);
      const opacityString = this._stringifyOpacity(data);
      const step = `${percent}% {${opacityString}}
`;
      keyframes += step;
      if (data.visibility === "appearing" || data.visibility === "disappearing") {
        const switchStepData: IntermediateStepData = { ...data, visibility: data.visibility === "disappearing" ? "hidden" : "visible" };
        const opacityString = this._stringifyOpacity(switchStepData);
        const switchStep = `${percent + 0.0001}% {${opacityString}}`;
        keyframes += switchStep;
      }
    }
    return keyframes;
  };

  createZIndexKeyframes = (intermediateStepData: IntermediateStepData[], totalDuration: number) => {
    // const totalDuration = intermediateStepData[intermediateStepData.length - 1].accDuration;
    let keyframes = "";
    for (const data of intermediateStepData) {
      const percent = Math.floor((data.accDuration / totalDuration) * 100);
      const opacityString = this._stringifyZIndex(data);
      const step = `${percent}% {${opacityString}}
`;
      keyframes += step;
      if (data.visibility === "appearing" || data.visibility === "disappearing") {
        const switchStepData: IntermediateStepData = { ...data, visibility: data.visibility === "disappearing" ? "hidden" : "visible" };
        const opacityString = this._stringifyZIndex(switchStepData);
        const switchStep = `${percent + 0.0001}% {${opacityString}}`;
        keyframes += switchStep;
      }
    }
    return keyframes;
  };

  // Makes sure each parallel step on different tracks is the same length
  setStepDurations = (animationTracks: AnimationTrack[], startDelay?: number) => {
    const longestDurationInStep = Array(animationTracks[0].steps.length);

    for (const track of animationTracks) {
      if (startDelay) {
        track.steps.unshift(new AnimationTrackStep({ duration: startDelay }));
      }
      for (let i = 0; i < track.steps.length; i++) {
        const currStepDuration = track.steps[i].duration ?? 0;
        if (!longestDurationInStep[i] || currStepDuration > longestDurationInStep[i]) {
          longestDurationInStep[i] = currStepDuration;
        }
      }
    }

    const updatedTracks = animationTracks.map(track => {
      const updatedSteps = track.steps.map<AnimationTrackStep>((step, i) => ({ ...step, duration: longestDurationInStep[i] }));
      return { ...track, steps: updatedSteps };
    });
    return updatedTracks;
  };

  getActiveAnimation = (): ActiveAnimation => ({
    animations: this.animationData,
    showPrevSnapshot: this.showPrevSnapshot,
    totalDuration: this.totalDuration,
  });
}

interface IntermediateStepData {
  style: CardCSSMap;
  accDuration: number;
  offset: Offset;
  visibility: Visibility;
}

class AnimationTrackStep {
  duration?: number;
  isProxy?: boolean;
  fromOffset?: Offset;
  toOffset?: Offset;
  fromStyles?: CardCSSMap;
  toStyles?: CardCSSMap;
  zeroOffset: ZeroOffsetOf;
  visibility?: Visibility;

  constructor(args: AnimationTrackStepArgs) {
    const { duration, isProxy, fromOffset, toOffset, fromStyles, toStyles, zeroOffset, visibility } = args;
    this.duration = duration;
    this.isProxy = isProxy || false;
    this.fromOffset = fromOffset;
    this.toOffset = toOffset;
    this.fromStyles = fromStyles;
    this.toStyles = toStyles;
    this.zeroOffset = zeroOffset || "none";
    this.visibility = visibility;
  }
}

export interface AnimationTrackStepArgs {
  isProxy?: boolean;
  duration?: number;
  fromOffset?: Offset;
  toOffset?: Offset;
  fromStyles?: CardCSSMap;
  toStyles?: CardCSSMap;
  zeroOffset?: ZeroOffsetOf;
  visibility?: Visibility;
}

class OneOrTwoSteps {
  private lower!: Visibility;
  private higher?: Visibility;
  private lowerIndex!: number;
  private higherIndex?: number;

  // constructor(lower: AnimationTrackStep, lowerIndex: number, higher?: AnimationTrackStep, higherIndex?: number) {
  constructor(steps: AnimationTrackStep[]) {
    steps.forEach((step, index) => {
      if (step.visibility && !this.lower) {
        this.lower = step.visibility;
        this.lowerIndex = index;
      }
      if (step.visibility && this.lower) {
        this.higher = step.visibility;
        this.higherIndex = index;
      }
    });
  }

  getLower = () => this.lower;

  getLowerIndex = () => this.lowerIndex;

  getHigher = () => this.higher ?? this.lower;

  getHigherIndex = () => this.higherIndex ?? this.lowerIndex;

  isEmpty = () => this.lower === undefined;
}

export class AnimationTrack {
  homePlaceId?: number;
  // startDelay?: number;
  cardId: number;
  totalDuration?: number;
  transformStartOffset: Offset;
  transformEndOffset: Offset;
  steps: AnimationTrackStep[] = [];

  constructor(args: AnimationTrackArgs) {
    const { cardId, homePlaceId, steps } = args;
    this.homePlaceId = homePlaceId;
    this.cardId = cardId;
    // this.startDelay = startDelay;
    const { transformStartOffset, transformEndOffset } = this.scanForStartAndEndTransformOffset(steps);
    this.transformStartOffset = transformStartOffset!;
    this.transformEndOffset = transformEndOffset!;
    this.steps = steps;
  }

  scanForStartAndEndTransformOffset = (steps: AnimationTrackStep[]) => {
    // A proxy animation isnt anchored in a place.
    // It is a free-floating absolutely positioned card
    const proxyStep = steps.find(step => step.isProxy);
    if (proxyStep) {
      return { transformStartOffset: proxyStep.fromOffset, transformEndOffset: proxyStep.toOffset };
    }
    const stepWithZeroOffset = steps.find(step => step.zeroOffset !== "none");

    if (stepWithZeroOffset) {
      if (stepWithZeroOffset.zeroOffset === "fromOffset") {
        // if zero offset is starting position
        const { fromOffset, toOffset } = stepWithZeroOffset;
        if (!fromOffset || !toOffset) throw new Error("from or to missing!");
        const transformEndOffset = toOffset.minus(fromOffset);

        return { transformStartOffset: new Offset({ dx: 0, dy: 0 }), transformEndOffset };
      } else {
        // if zero offset is where it animates to (FLIP animation)
        const { toOffset, fromOffset } = stepWithZeroOffset;
        if (!fromOffset || !toOffset) throw new Error("from or to missing!");
        const transformStartOffset = fromOffset.minus(toOffset);
        return { transformStartOffset, transformEndOffset: new Offset({ dx: 0, dy: 0 }) };
      }
    }
    throw Error("No step has zero offset in this track!");
  };

  getIntermediateSteps = (steps: AnimationTrackStep[], startDelay?: number): IntermediateStepData[] => {
    const transitionStep = steps.find(step => step.fromOffset && step.toOffset && step.fromStyles && step.toStyles);
    if (!transitionStep) {
      console.error("No transition step found!");
      return [];
    }

    let offset = new Offset({ dx: 0, dy: 0 });
    let style = {} as CardCSSMap;
    // Add one because we will add an extra element in the next step
    let transitionStepIndex = steps.indexOf(transitionStep) + 1;
    const { fromStyles, toStyles } = transitionStep;

    // Add an extra step where duration is "0" so we have a 0% starting point
    // eg 0%{ height: 100 }
    const extraFirstStep = new AnimationTrackStep({ duration: 0 });
    steps.unshift(extraFirstStep); // = [extraFirstStep, ...steps];

    const visibilitySteps = new OneOrTwoSteps(steps);

    let accDuration = 0;
    return steps.map((step, index) => {
      let visibility = step.visibility;
      accDuration += step.duration ?? 0;

      if (index < transitionStepIndex) {
        offset = this.transformStartOffset;
        style = fromStyles!;
      } else {
        offset = this.transformEndOffset;
        style = toStyles!;
      }
      if (visibilitySteps.isEmpty()) visibility = "visible";
      // if (!visibilityStep) visibility = "visible";
      else {
        if (index < visibilitySteps.getLowerIndex()) {
          visibility = visibilitySteps.getLower() === "appearing" ? "hidden" : "visible";
        }
        if (index > visibilitySteps.getLowerIndex() && index < visibilitySteps.getHigherIndex()) {
          visibility = visibilitySteps.getHigher() === "appearing" ? "hidden" : "visible";
        }

        if (index > visibilitySteps.getHigherIndex()) {
          visibility = visibilitySteps.getHigher() === "appearing" ? "visible" : "hidden";
        }
      }
      return { offset, style, accDuration, visibility: visibility! };
    });
  };
}

interface AnimationTrackArgs {
  cardId: number;
  homePlaceId?: number;
  steps: AnimationTrackStep[];
}

type ZeroOffsetOf = "fromOffset" | "toOffset" | "none";

type Visibility = "visible" | "hidden" | "appearing" | "disappearing";

export class NothingHappens extends AnimationTrackStep {
  constructor() {
    super({ duration: 0 });
  }
}

export class ProxyAppear extends AnimationTrackStep {}

export class ProxyDisappear extends AnimationTrackStep {}

export class TableToDiscard extends AnimationTrackStep {}

export class TableToMiddle extends AnimationTrackStep {}

export class MiddleToHand extends AnimationTrackStep {}

export class MiddleToTable extends AnimationTrackStep {}

export class FromDisappears extends AnimationTrackStep {
  constructor(args: AnimationTrackStepArgs) {
    super({ ...args, duration: 10, visibility: "disappearing" });
  }
}

export class ToAppears extends AnimationTrackStep {
  constructor(args: AnimationTrackStepArgs) {
    super({ ...args, duration: 10, visibility: "appearing" });
  }
}

export class HandToMiddle extends AnimationTrackStep {
  constructor(args: AnimationTrackStepArgs) {
    const { fromOffset, fromStyles, zeroOffset, duration = 1000 } = args;
    super({ duration, toOffset: getMiddleOffset(), toStyles: getMiddleStyles(), fromOffset, fromStyles, zeroOffset });
  }
}

export const animate = (cardId: number, newSnapshot: GameSnapshot) => {};
