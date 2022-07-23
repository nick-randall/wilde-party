import { DragAction } from "../types/dragDataTypes";
import { NewSnapshotActions } from "./newSnapshotActions";
import { TransitionQueueActions } from "./transitionQueueActionCreators";

export type LocationData = {
  index: number;
  droppableId: string;
};

export type SetInitialDraggedState = {
  type: "SET_INITIAL_DRAGGED_STATE";
  payload: { draggedId: string; source: DragSourceData; destination: LocationData };
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
  payload: string | undefined;
};

export type EndDragCleanup = {
  type: "END_DRAG_CLEANUP";
};

export type DrawCard = {
  type: "DRAW_CARD";
  payload: { handId: string; player: number };
};

export type DestroyCard = {
  type: "DESTROY_CARD";
  payload: string;
};

export type DiscardPlayedCard = {
  type: "DISCARD_PLAYED_CARD";
  payload: string;
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

export type SetAiPlaying = { type: "SET_AI_PLAYING"; payload: string };

//export type Thunk = (args: any) => (dispatch: Function, getState: Function) => void

export type Action =
  | DragAction
  | SetScreenSize
  | SetHandCardDrag
  | SetHighlights
  | EndDragCleanup
  | DrawCard
  | ChangeNumPlays
  | ChangeNumDraws
  | ChangeNumRolls
  | EndCurrentTurn
  | EndCurrentPhase
  | DealStartingGuest
  | DestroyCard
  | DiscardPlayedCard
  | SetAiPlaying
  | TransitionQueueActions
  | NewSnapshotActions;
//| //Thunk;
