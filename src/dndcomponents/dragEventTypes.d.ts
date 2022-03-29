
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
  source?: DragSourceData;
  destination?: DragDestinationData;
}

