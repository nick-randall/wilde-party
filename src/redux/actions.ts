export type RemoveTransition = {
  type: "REMOVE_TRANSITION",
  payload: string;
}

export type Action =  RemoveTransition //| SetRearrangingCardsData | UpdateDraggedOverIndex | EndRearrange;
