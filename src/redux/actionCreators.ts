import { AddTranstion, DrawCard, Rearrange, UpdateDrag } from "./actions";

// export const addTransition = (transitionData: TransitionData): AddTranstion => ({ type: "ADD_TRANSITION", payload: transitionData });

// export const rearrange = (source: DraggedOverData, destination: DraggedOverData): Rearrange => ({type: "REARRANGE", payload: {source, destination}});

// export const startRearranging = (data: SimpleRearrangingData) => ({type: "START_REARRANGING", payload: data});

// export const updateDraggedOver = (data: DraggedOverData | undefined):  UpdateDrag  => ({type: "UPDATE_DRAGGED_OVER", payload: data});


export const enactDrawCardEvent = (player: number, handId: number): DrawCard => ({
  type: "DRAW_CARD",
  payload: {player: player, handId: handId},
});
