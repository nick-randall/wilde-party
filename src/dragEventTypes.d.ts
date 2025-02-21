
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
type DraggedOverData = { // LEGACY
  type: DroppableEntityType,
  id: number,
  index: number,
  enchantableNeighbours?: EnchantableNeighbour[]
}
type UpdateDragData = {
  droppableData: DroppableData,
  index: number
}
// Build an object with this, stringify it and set it as DroppableId
type DroppableData = {
  type: DroppableEntityType,
  id: number,
  index?: number,
  placeType?: PlaceType,
  player?: number,
  calculatedIndex?: number // use this as destination index instead if not undefined 
  enchantableNeighbours?: EnchantableNeighbour[]
}

type DraggableData = {
  id: number, // If type == "cardGroup", use first id in card group as id
  type: DraggableEntityType,
  // legalActions: ActionData[],
  // actionType: ActionType;
  numCards?: number,

}

// type DroppableData = {
//   id: number, // If type == "cardGroup", use first id in card group as id
//   type: DraggableEntityType,
//   // legalActions: ActionData[],
//   // actionType: ActionType;
//   numCards?: number,
// }

type ActionData = {
  resultingGameSnapshot?: GameSnapshot;
  targetType: LegalTargetType;
};

type DraggableEntityType = "card" | "handCard" | "cardGroup";

type DroppableEntityType = "player" | "place" | "cardGroup" | "card" | "handCard";

type CardGroupObj = {
  id: number;
  size: number;
  cards: CardGroup;
};

type EnchantableNeighbour = "left" | "right";
