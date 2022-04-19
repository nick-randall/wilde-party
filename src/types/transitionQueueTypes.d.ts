type TransitionTemplate = 
// {
//   status: TransitionTemplateStatus;
//   to: ToOrFrom & ScreenToData;
//   from: ToOrFrom & ScreenFromData;
// };

SnapshotChange & { id: string; status: string; orderOfExecution: number; animation?: string};

type TransitionTemplateStatus = "waitingInLine" | "underway" | "complete";

type CompleteTransitionTemplate = {
  status: TransitionTemplateStatus;
  to: ToOrFrom & { xPosition: number; yPosition: number };
  from: ToOrFrom & { xPosition: number; yPosition: number; rotation: number; dimensions: AllDimensions };
};

type ScreenToData = {
  xPosition?: number;
  yPosition?: number;
};

type ScreenFromData = ScreenToData & {
  rotation?: number;
  dimensions?: AllDimensions;
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

type NewSnapshot = GameSnapshot & { transitionTemplates: TransitionTemplate[] };
