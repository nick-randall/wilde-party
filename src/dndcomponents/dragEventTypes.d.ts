
type DragDestinationData = {
  containerId: string;
  index: number;
 
}

 type DragSourceData = {
  containerId: string;
  index: number;
  numDraggedElements: number
}

type DraggedState = {
  draggedId?: string;
  source?: DragSourceData;
  destination?: DragDestinationData;
  isInitialRearrange?: boolean;
}

type DraggedResult = {
  source: DragSourceData;
  destination: DragDestinationData;
}

type DragEndTarget = {
  x: number,
  y: number
}

