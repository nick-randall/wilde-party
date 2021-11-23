import { DropResult } from "react-beautiful-dnd";

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
}

export type EndDrag = {
  type: "END_DRAG";
  payload: DropResult;
};

export type Action =
  | RemoveTransition
  | SetHandCardDrag
  | SetHighlights;
