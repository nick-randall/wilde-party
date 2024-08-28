
type SimpleRearrangingData = {
  placeId: number,
  draggedId: number,
  sourceIndex: number
}

// type DraggedOverData = {
//   placeId: number,
//   index: number
// }
///TODO just use
type DraggedOverData = {
  type: DroppableEntityType,
  id: number,
  index: number
}
type UpdateDragData = {
  droppableData: DroppableData,
  index: number
}
// Build an object with this, stringify it and set it as DroppableId
type DroppableData = {
  type: DroppableEntityType,
  id: number,
  calculatedIndex?: number // use this as destination index instead if not undefined 
}

type DraggableData = {
  id: number, // If type == "cardGroup", use first id in card group as id
  type: DraggableEntityType,
  // legalActions: ActionData[],
  // actionType: ActionType;
  numCards?: number,
}

type ActionData = {
  resultingGameSnapshot?: GameSnapshot;
  targetType: LegalTargetType;
};

type DraggableEntityType = "card" | "cardGroup";

type DroppableEntityType = "player" | "place" | "cardGroup" | "card";

type CardGroupObj = {
  id: number;
  size: number;
  cards: CardGroup;
};