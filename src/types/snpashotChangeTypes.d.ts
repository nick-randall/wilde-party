type ToOrFrom = {
  cardId: string;
  place: PlaceType;
  placeId: string;
  player: number | null;
  playerId: string | null;
  index: number;
  xPosition?: number
  yPosition?: number
}
type SnapshotChange = {
  from: ToOrFrom;
  to: ToOrFrom;
}