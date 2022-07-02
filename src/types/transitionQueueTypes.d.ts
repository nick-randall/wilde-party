/**
 * All the data needed to create a transition, though either
 * the screen data of xPosition/yPosition at origin
 * or destination is still missing.
 */
type TransitionTemplate = {
  to: ToWithPossibleScreenData | ToViaWithPossibleScreenData;
  from: FromWithPossibleScreenData | FromViaWithPossibleScreenData;
} & { id: string; status: TransitionTemplateStatus; orderOfExecution: number; animation?: string; delay?: number };

type TransitionTemplateStatus = "waitingInLine" | "awaitingEmissaryData" | "awaitingSimultaneousTemplates" | "underway" | "complete";

type CompleteTransitionTemplate = {
  id: string;
  status: TransitionTemplateStatus;
  animation?: string;
  delay?: number;
  to: ToWithScreenData | ToViaWithScreenData;
  from: FromWithScreenData | FromViaWithScreenData;
};

type AnimationTemplate = {
  to: ToWithPossibleScreenData | ToViaWithPossibleScreenData;
  from: FromWithPossibleScreenData | FromViaWithPossibleScreenData;
} & { id: string; status: AnimationTemplateStatus; orderOfExecution: number; animation?: string; delay?: number };

type AnimationTemplateStatus = "waitingInLine" | "awaitingEmissaryData" | "awaitingSimultaneousTemplates" | "underway" | "complete";

type CompleteAnimationTemplate = {
  id: string;
  status: AnimationTemplateStatus;
  startAnimation?: string;
  delay?: number;
  to: ToWithScreenData | ToViaWithScreenData;
  from: FromWithScreenData | FromViaWithScreenData;
};

type ToWithScreenData = ToOrFrom & CompleteScreenToData;
type FromWithScreenData = ToOrFrom & CompleteScreenFromData;
type ToViaWithScreenData = Via & CompleteScreenToData;
type FromViaWithScreenData = Via & CompleteScreenFromData;

type ToWithPossibleScreenData = ToOrFrom & ScreenToData;
type FromWithPossibleScreenData = ToOrFrom & ScreenFromData;
type ToViaWithPossibleScreenData = Via & ScreenToData;
type FromViaWithPossibleScreenData = Via & ScreenFromData;

type ScreenToData = {
  xPosition?: number;
  yPosition?: number;
};

type ScreenFromData = ScreenToData & {
  rotation?: number;
  dimensions?: AllDimensions;
};

type CompleteScreenToData = {
  xPosition: number;
  yPosition: number;
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

type AnimationData = {
  cardId: string;
  originDimensions: AllDimensions;
  originDelta: { x: number; y: number };
  transitionDuration: number;
  transitionCurve: string;
  initialRotation?: number;
  startAnimation?: string;
  startAnimationDuration?: number;
  wait: number;
};

//
type ScreenData = {
  xPosition?: number;
  yPosition?: number;
  rotation?: number;
  dimensions?: AllDimensions;
};

type CompleteScreenData = {
  xPosition: number;
  yPosition: number;
  rotation: number;
  dimensions: AllDimensions;
};

type ToOrFromWithPossibleScreenData = ToOrFrom & ScreenData;
type ViaWithPossibleScreenData = Via & ScreenData;

type ToOrFromWithScreenData = ToOrFrom & CompleteScreenData;
type ViaWithScreenData = Via & CompleteScreenData;

type AnimationTemplateNewVersion = {
  to: ToOrFromWithPossibleScreenData | ViaWithPossibleScreenData
  from: ToOrFromWithPossibleScreenData | ViaWithPossibleScreenData;
} & { id: string; status: AnimationTemplateStatus; animation?: string; delay?: number };

type MockRenderData = ScreenData & { cardId: string }

type CompleteAnimationTemplateNewVersion = {
  id: string;
  status: AnimationTemplateStatus;
  startAnimation?: string;
  delay?: number;
  to: ToOrFromWithScreenData | ViaWithScreenData;
  from: ToOrFromWithScreenData | ViaWithScreenData;
};

//

type NewSnapshot = GameSnapshot & { transitionTemplates?: TransitionTemplate[]; animationTemplates: AnimationTemplate[] };
