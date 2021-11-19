export type RemoveTransition = {
  type: "REMOVE_TRANSITION",
  payload: string;
}

export type StartGCZRearrangingData = {
  type: "START_GCZ_REARRANGE",
  payload: GCZRearrangingData
}

export type UpdateGCZRearrangingIndex = {
  type: "UPDATE_GCZ_REARRANGING_INDEX"
  payload: number
}

export type EndGCZRearrange = {
  type: "END_GCZ_REARRANGE",
  payload: { targetIndex: number },
}

export type SetHandCardDrag = {
  type: "SET_HAND_CARD_DRAG",
  payload: string | undefined;

}

export type Action =  RemoveTransition | StartGCZRearrangingData | UpdateGCZRearrangingIndex | EndGCZRearrange | SetHandCardDrag;
