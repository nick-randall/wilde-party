type DragDestinationData = {
  containerId: string;
  index: number;
 
}

type DragSourceData = {
  containerId: string;
  index: number;
  trueSourceIndex?: number
  numDraggedElements?: number
}

type DraggedState = {
  source?: DragSourceData;
  destination?: DragDestinationData;
  isInitialRearrange?: boolean;
}
