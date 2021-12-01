import { Combine, DraggableLocation, DragStart, DropResult } from "react-beautiful-dnd";

export type RemoveTransition = {
  type: "REMOVE_TRANSITION";
  payload: string;
};

export type SetHandCardDrag = {
  type: "SET_DRAGGED_HAND_CARD";
  payload: string | undefined;
};

export type SetHighlights = {
  type: "SET_HIGHLIGHTS";
  payload: string | undefined;
};

export type AllowRearranging = {
  type: "ALLOW_REARRANGING";
  payload: string;
};

export type UpdateDrag = {
  type: "UPDATE_DRAG";
  payload: DraggableLocation;
};

export type Rearrange = {
  type: "REARRANGE";
  payload: { source: DraggableLocation; destination: DraggableLocation };
};

export type AddDragged = {
  type: "ADD_DRAGGED";
  payload: { source: DraggableLocation; destination: DraggableLocation };
};

export type Enchant = {
  type: "ENCHANT";
  payload: DropResult;
};

export type EndDragCleanup = {
  type: "END_DRAG_CLEANUP";
};

export type Action =
  | RemoveTransition
  | SetHandCardDrag
  | AllowRearranging
  | UpdateDrag
  | SetHighlights
  | Rearrange
  | AddDragged
  | Enchant
  | EndDragCleanup;
