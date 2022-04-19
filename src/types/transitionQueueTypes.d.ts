type TransitionTemplate = {
  status: TransitionTemplateStatus;
  to: ToOrFrom & ScreenToData;
  from: ToOrFrom & ScreenFromData;
};

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

type NewSnapshot = GameSnapshot & { transitionTemplates: TransitionTemplate[] };
