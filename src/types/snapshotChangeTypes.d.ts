/**
 * A snapshot update is the input used to create a new game Snapshot.
 * It is generated from draggedData, ie. where the drag started and
 * where it stopped
 */

 type SnapshotUpdate = {
  from: SnapshotLocation;
  to: SnapshotLocation;
}

type TransitionSet = {
  status: "pending" | "ready",
  transitions: TransitionData[],
}

/**
 * A snapshot change is a the summary of what has changed in the 
 * snapshot. It is the output of analysing the before and after
 * of a changed snapshot. It describes how a card has moved from 
 * one part of the game to another. This is then used to generate
 * transition data.
 */

 type SnapshotChange = {
  from: ToOrFrom;
  to: ToOrFrom;
}

type PendingTransition = SnapshotChange & { orderOfExecution: number }

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


type SnapshotLocation = {
  player: number | null;
  place: PlaceType;
  index: number;
}

type SimpleSnapshotLocator = {
  player: number | null;
  place: PlaceType;
}

type SnapshotUpdateType = "initialSnapshot" | "dealingInitialCard" | "rearrangingHand" | "rearrangingTablePlace" | "drawingWildeParty" | ActionType;
