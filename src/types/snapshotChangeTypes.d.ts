/**
 * A snapshot update is the input used to create a new game Snapshot.
 * It is generated from draggedData, ie. where the drag started and
 * where it stopped
 */

type SnapshotUpdate = {
  from: SnapshotLocation;
  to: SnapshotLocation;
};

/**
 * A snapshot change is a the summary of what has changed in the
 * snapshot. It is the output of analysing the before and after
 * of a changed snapshot. It describes how a card has moved from
 * one part of the game to another. This is then used to generate
 * transition data.
 */

type SnapshotDifference = {
  from: ToOrFrom;
  to: ToOrFrom;
};

type PendingTransition = SnapshotChange & { orderOfExecution: number };

type ToOrFrom = {
  cardId: string;
  place: PlaceType;
  placeId: string;
  player: number | null;
  playerId: string | null;
  index: number;
};

type Via = {
  cardId: string;
  targetId: string;
};

type SnapshotLocation = {
  player: number | null;
  place: PlaceType;
  index: number;
};

type SimpleSnapshotLocator = {
  player: number | null;
  place: PlaceType;
};

type SnapshotUpdateType =
  | "initialSnapshot"
  | "dealingInitialCards"
  | "dealingCards"
  | "rearrangingHand"
  | "rearrangingTablePlace"
  | "drawingWildeParty"
  | ActionType;
