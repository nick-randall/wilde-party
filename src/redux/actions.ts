import { Combine, DraggableLocation, DragStart, DropResult } from "react-beautiful-dnd";

export type SetScreenSize = {
  type: "SET_SCREEN_SIZE";
};

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

export type StartRearranging = {
  type: "START_REARRANGING";
  payload: SimpleRearrangingData;
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

export type DrawCard = {
  type: "DRAW_CARD";
  payload: number;
};

export type AddTranstion = {
  type: "ADD_TRANSITION";
  payload: TransitionData;
};

export type Test = { type: "TEST" };

export type Action =
  | SetScreenSize
  | RemoveTransition
  | SetHandCardDrag
  | StartRearranging
  | UpdateDrag
  | SetHighlights
  | Rearrange
  | AddDragged
  | Enchant
  | EndDragCleanup
  | DrawCard
  | Test
  | AddTranstion;
