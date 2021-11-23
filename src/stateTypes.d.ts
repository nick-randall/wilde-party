
type GCZRearrangingData = {
  cardRowShape: number[],
  index: number,
  ghostCardsObject: CardGroupObj

}

type SimpleGCZRearrangingData = {
  cardGroupId: string,
  index: number,
}


type RearrangingData = {
  placeId: string,
  card: GameCard,
  index: number
}

type SimpleRearrangingData = {
  placeId: string,
  cardId: string,
  index: number
}

type DraggedOverData = {
  placeId: string,
  index: number
}




type UpdateDragData = {
  droppableId: string,
  index: number
}