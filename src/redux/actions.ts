export type RemoveTransition = {
  type: "REMOVE_TRANSITION",
  payload: string;
}

export type StartGCZRearrangingData = {
  type: "START_GCZ_REARRANGE",
  payload: GCZRearrangingData
}

export type Action =  RemoveTransition | StartGCZRearrangingData;//SetRearrangingCardsData | UpdateDraggedOverIndex | EndRearrange;
