export const x=0;
// import { DragUpdate } from "react-beautiful-dnd";
// import { getCardRowAndShape } from "../helperFunctions/groupGCZCards";
// import { locate2 } from "../helperFunctions/locateFunctions";
// import { UpdateDrag } from "./actions";
// import { RootState } from "./store";

// export const getUpdateDragAction = (state: RootState, action: UpdateDrag) => {
//   if (state.GCZRearrangingData !== undefined) return updateGCZRearrange;
//   if (state.rearrangingData !== undefined) return updatePlaceRearrange;
//   // If hand card is dragged over place that can accept it.
//   if (state.draggedHandCard !== undefined) return updateDraggedOver;
//   console.log("nope");
//   return doNothing;
// };

// const doNothing = (state: RootState, update: DragUpdate) => state;

// export const onNewGCZRearrange = (GCZRearrangingData: GCZRearrangingData, { index }: { index: number }): GCZRearrangingData => {
//   const { cardRowShape } = GCZRearrangingData;
//   const newIndex = cardRowShape[index];
//   return { ...GCZRearrangingData, index: newIndex };
// };

// const onNewRearrange = (placeId: string, index: number) => 

// //const onNewPlaceRearrange

// const updateGCZRearrange = (state: RootState, update: DragUpdate) => {
//   if (state.GCZRearrangingData && update.destination) {
//     const { cardRowShape } = state.GCZRearrangingData;
//     const { index } = update.destination;
//     state.GCZRearrangingData.index = cardRowShape[index];
//   }
//   return state;
// };

// const updatePlaceRearrange = (state: RootState, update: DragUpdate) => {
//   if (update.destination && state.rearrangingData) {
//     const { index } = update.destination;
//     state.rearrangingData.index = index;
//   }
//   return state;
// };

// const updateDraggedOver = (state: RootState, data: DragUpdate) => {
//   if (data.destination === undefined) return state;
//   else {
//     const { droppableId, index } = data.destination;
//     const { place } = locate2(droppableId, state.gameSnapshot);
//     if (place === "GCZ") return updateDraggedOverGCZ(state, droppableId, index);
//     else return updateDraggedOverPlace(state, droppableId, index);
//   }
// };

// const updateDraggedOverGCZ = (state: RootState, placeId: string, newIndex: number) => {
//   const { shape } = getCardRowAndShape(state.gameSnapshot, newIndex);
//   state.draggedOverData = {
//     index: shape[newIndex],
//     placeId: placeId,
//   };
//   return state;
// };

// const updateDraggedOverPlace = (state: RootState, placeId: string, newIndex: number) => {
//   state.draggedOverData = {
//     index: newIndex,
//     placeId: placeId,
//   };
//   return state;
// };

// export default getUpdateDragAction;
