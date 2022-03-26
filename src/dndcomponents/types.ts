export interface DraggedState {
  source?: DragLocation;
  destination?: DragLocation;
  isInitialRearrange?: boolean;
}

export interface DragLocation {
  containerId: string;
  index: number;
  trueSourceIndex?: number
}