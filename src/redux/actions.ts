import { DropResult } from "react-beautiful-dnd";

export type DraggableLocation = {
  index: number;
  droppableId: string;
};

export type SetScreenSize = {
  type: "SET_SCREEN_SIZE";
};

export type SetHandCardDrag = {
  type: "SET_DRAGGED_HAND_CARD";
  payload: string | undefined;
};

export type SetHighlights = {
  type: "SET_HIGHLIGHTS";
  payload: number | undefined;
};

export type StartRearranging = {
  type: "START_REARRANGING";
  payload: SimpleRearrangingData;
};


export type UpdateDrag = {
  type: "UPDATE_DRAGGED_OVER";
  payload: DraggedOverData | undefined;
};

export const updateDraggedOver = (data: DraggedOverData | undefined):  UpdateDrag  => ({type: "UPDATE_DRAGGED_OVER", payload: data});

export type Rearrange = {
  type: "REARRANGE";
  payload: { source: DraggedOverData; destination: DraggedOverData };
};


export type AddDragged = {
  type: "ADD_DRAGGED";
  payload: { source: DraggableLocation; destination: DraggableLocation };
};

// export type Enchant = {
//   type: "ENCHANT";
//   payload: DropResultEvent;
// };

export type EndDragCleanup = {
  type: "END_DRAG_CLEANUP";
};

export type DrawCard = {
  type: "DRAW_CARD";
  payload: { handId: number; player: number };
};

export type DestroyCard = {
  type: "DESTROY_CARD";
  payload: number;
};

export type AddTranstion = {
  type: "ADD_TRANSITION";
  payload: TransitionData;
};

export type RemoveTransition = {
  type: "REMOVE_TRANSITION";
  payload: number;
};

export type DiscardPlayedCard = {
  type: "DISCARD_PLAYED_CARD";
  payload: number;
};

export type ChangeNumDraws = {
  type: "CHANGE_NUM_DRAWS";
  payload: number;
};

export type ChangeNumPlays = {
  type: "CHANGE_NUM_PLAYS";
  payload: number;
};

export type ChangeNumRolls = {
  type: "CHANGE_NUM_ROLLS";
  payload: number;
};

export type EndCurrentTurn = {
  type: "END_CURRENT_TURN";
};
export type EndCurrentPhase = { type: "END_CURRENT_PHASE" };

export type DealStartingGuest = {
  type: "DEAL_STARTING_GUEST";
  payload: number;
};

export type SetAiPlaying = { type: "SET_AI_PLAYING"; payload: number };

//export type Thunk = (args: any) => (dispatch: Function, getState: Function) => void

export type Action =
  | SetScreenSize
  | RemoveTransition
  | SetHandCardDrag
  | StartRearranging
  | UpdateDrag
  | SetHighlights
  | Rearrange
  | AddDragged
  // | Enchant
  | EndDragCleanup
  | DrawCard
  | ChangeNumPlays
  | ChangeNumDraws
  | ChangeNumRolls
  | AddTranstion
  | RemoveTransition
  | EndCurrentTurn
  | EndCurrentPhase
  | DealStartingGuest
  | DestroyCard
  | DiscardPlayedCard
  | SetAiPlaying;
//| //Thunk;
