type TransitionTemplate = {
  to: ToWithPossibleScreenData; 
  from: FromWithPossibleScreenData;
} & { id: string; status: string; orderOfExecution: number; animation?: string };


type TransitionTemplateStatus = "waitingInLine" | "underway" | "complete";

type CompleteTransitionTemplate = {
  id: string
  status: TransitionTemplateStatus;
  animation?: string;
  to: ToWithScreenData;
  from: FromWithScreenData; 
};

type ToWithScreenData = ToOrFrom & CompleteScreenToData
type FromWithScreenData = ToOrFrom & CompleteScreenFromData
type ToWithPossibleScreenData = ToOrFrom & ScreenToData
type FromWithPossibleScreenData = ToOrFrom & ScreenFromData


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
}

type CompleteScreenFromData = CompleteScreenToData & {
  rotation: number;
  dimensions: AllDimensions;
}

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

type NewSnapshot = GameSnapshot & { transitionTemplates: TransitionTemplate[] };
