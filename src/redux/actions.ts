import { DragStart, DragUpdate, DropResult } from "react-beautiful-dnd";

export type RemoveTransition = {
  type: "REMOVE_TRANSITION";
  payload: string;
};

export type StartGCZRearrangingData = {
  type: "START_GCZ_REARRANGE";
  payload: GCZRearrangingData;
};

export type UpdateGCZRearrangingIndex = {
  type: "UPDATE_GCZ_REARRANGING_INDEX";
  payload: number;
};

export type EndGCZRearrange = {
  type: "END_GCZ_REARRANGE";
  payload: { targetIndex: number };
};

export type SetHandCardDrag = {
  type: "SET_HAND_CARD_DRAG";
  payload: string | undefined;
};

export type SetHandCardDraggedOver = {
  type: "SET_HAND_CARD_DRAGGED_OVER";
  payload: { placeId: string; index: number };
};

export type StartDrag = {
  type: "START_DRAG";
  payload: DragStart;
};

export type UpdateDrag = {
  type: "UPDATE_DRAG";
  payload: DragUpdate;
};

export type EndDrag = {
  type: "END_DRAG";
  payload: DropResult;
};

export type Action =
  | RemoveTransition
  | StartGCZRearrangingData
  | UpdateGCZRearrangingIndex
  | EndGCZRearrange
  | SetHandCardDrag
  | SetHandCardDraggedOver
  | StartDrag
  | UpdateDrag
  | EndDrag;
