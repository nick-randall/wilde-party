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

type SnapshotLocation = {
  player: number | null;
  place: PlaceType;
  index: number;
}

type SimpleSnapshotLocator = {
  player: number | null;
  place: PlaceType;
}