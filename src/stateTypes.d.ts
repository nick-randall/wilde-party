
type GCZRearrangingData = {
  cardRowShape: number[],
  index: number,
  ghostCardsObject: CardGroupObj

}

type SimpleGCZRearrangingData = {
  cardGroupid: number,
  index: number,
}


type RearrangingData = {
  placeId: number,
  card: GameCard,
  index: number
}

type SimpleRearrangingData = {
  placeId: number,
  draggableId: number,
  sourceIndex: number
}

type DraggedOverData = {
  placeId: number,
  index: number
}

type UpdateDragData = {
  droppableId: number,
  index: number
}
