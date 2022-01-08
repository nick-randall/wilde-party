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
  payload: {handId: string, player: number};
};

export type AddTranstion = {
  type: "ADD_TRANSITION";
  payload: TransitionData;
};

export type ChangeNumDraws = {
  type: "CHANGE_NUM_DRAWS",
  payload: number;
}

export type ChangeNumPlays = {
  type: "CHANGE_NUM_PLAYS",
  payload: number;
}

export type ChangeNumRolls = {
  type: "CHANGE_NUM_ROLLS",
  payload: number;
}

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
  | ChangeNumPlays
  | ChangeNumDraws
  | ChangeNumRolls
  | AddTranstion;
