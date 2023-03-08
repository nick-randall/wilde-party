/**
 * All the data needed to create a transition, though either
 * the screen data of dx/dy at origin
 * or destination is still missing.
 */

type AnimationTemplateStatus = "waitingInLine" | "awaitingScreenData" | "awaitingSimultaneousTemplates" | "underway" | "complete";

type ToWithScreenData = ToOrFrom & CompleteScreenToData;
type FromWithScreenData = ToOrFrom & CompleteScreenFromData;
// type ToViaWithScreenData = Via & CompleteScreenToData;
// type FromViaWithScreenData = Via & CompleteScreenFromData;

type ToWithPossibleScreenData = ToOrFrom & ScreenToData;
type FromWithPossibleScreenData = ToOrFrom & ScreenFromData;
// type ToViaWithPossibleScreenData = Via & ScreenToData;
// type FromViaWithPossibleScreenData = Via & ScreenFromData;

type ScreenToData = {
  dx?: number;
  dy?: number;
};

type ScreenFromData = ScreenToData & {
  rotation?: number;
  dimensions?: AllDimensions;
};

type CompleteScreenToData = {
  dx: number;
  dy: number;
};

type CompleteScreenFromData = CompleteScreenToData & {
  rotation: number;
  dimensions: AllDimensions;
};

type TransitionData = {
  cardId: string;
  originDelta: TopLeftCoordinates;
  wait: number; // if transition is not first in the queue
  duration: number;
  curve: string;
  originDimensions: AllDimensions;
  cardInitialrotation: number;
  startAnimationDuration: number;
  startAnimation: string;
};

// type  AnimationData = {
//   cardId: string;
//   originDimensions: AllDimensions;
//   finalDimensions: AllDimensions;
//   originDelta: { x: number; y: number };
//   transitionDuration: number;
//   transitionCurve: string;
//   initialRotation?: number;
//   finalRotation: number;
//   startAnimation?: string;
//   startAnimationDuration?: number;
//   wait: number;
// };
type AnimationData = {
  cardId: string;
  keyframesString: Keyframes;
  totalDuration: number;
};

//
type ScreenData = {
  dx?: number;
  dy?: number;
  dimensions?: CardAnimationDimensions;
};

type CompleteScreenData = {
  dx: number;
  dy: number;
  dimensions: CardAnimationDimensions;
};

type ToOrFromWithPossibleScreenData = ToOrFrom & ScreenData;
type ViaWithPossibleScreenData = Via & ScreenData;

type ToOrFromWithScreenData = ToOrFrom & CompleteScreenData;
type ViaWithScreenData = Via & CompleteScreenData;

type AnimationTemplate = {
  cardId: string;
  to: ToOrFromWithPossibleScreenData;
  via?: ViaWithPossibleScreenData;
  from: ToOrFromWithPossibleScreenData;
  intermediateSteps?: ViaWithPossibleScreenData[];
  awaits?: string;

} & { id: string; status: AnimationTemplateStatus; animationType: AnimationType; delay?: number };

type AnimationType = "handToTable" | "deckToHand" | "tableToDiscardPile";

type MockRenderData = ScreenData & { cardId: string };

type CompleteAnimationTemplate = {
  id: string;
  cardId: string;
  status: AnimationTemplateStatus;
  animationType: AnimationType;
  delay?: number;
  to: ToOrFromWithScreenData;
  from: ToOrFromWithScreenData;
  intermediateSteps: ViaWithScreenData[];
  awaits?: string;
};
