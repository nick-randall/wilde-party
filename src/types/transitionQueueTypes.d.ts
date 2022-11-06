/**
 * All the data needed to create a transition, though either
 * the screen data of xPosition/yPosition at origin
 * or destination is still missing.
 */

type AnimationTemplateStatus = "waitingInLine" | "awaitingEmissaryData" | "awaitingSimultaneousTemplates" | "underway" | "complete";

type ToWithScreenData = ToOrFrom & CompleteScreenToData;
type FromWithScreenData = ToOrFrom & CompleteScreenFromData;
// type ToViaWithScreenData = Via & CompleteScreenToData;
// type FromViaWithScreenData = Via & CompleteScreenFromData;

type ToWithPossibleScreenData = ToOrFrom & ScreenToData;
type FromWithPossibleScreenData = ToOrFrom & ScreenFromData;
// type ToViaWithPossibleScreenData = Via & ScreenToData;
// type FromViaWithPossibleScreenData = Via & ScreenFromData;

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
  finalDimensions: AllDimensions;
  originDelta: { x: number; y: number };
  transitionDuration: number;
  transitionCurve: string;
  initialRotation?: number;
  finalRotation: number;
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

type AnimationTemplate = {
  to: ToOrFromWithPossibleScreenData 
  via?: ViaWithPossibleScreenData
  from: ToOrFromWithPossibleScreenData ;
} & { id: string; status: AnimationTemplateStatus; animationType: AnimationType; delay?: number };

type AnimationType = "handToTable" | "deckToHand" | "tableToDiscardPile";

type MockRenderData = ScreenData & { cardId: string }

type CompleteAnimationTemplate = {
  id: string;
  status: AnimationTemplateStatus;
  animationType: AnimationType;
  delay?: number;
  to: ToOrFromWithScreenData | ViaWithScreenData;
  from: ToOrFromWithScreenData | ViaWithScreenData;
};
