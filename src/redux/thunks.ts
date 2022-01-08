import { DraggableLocation } from "react-beautiful-dnd";
import { buildTransition } from "../dimensions/buildTransition";
import { addTransition } from "./actionCreators";

export const drawCardThunk = (player: number) => (dispatch: Function, getState: Function) => {
  const state = getState();
  const { gameSnapshot } = state;
  const deckId = gameSnapshot.nonPlayerPlaces["deck"].id;
  const originIndex = 0;
  const handId = gameSnapshot.players[player].places.hand.id;
  const cardId = gameSnapshot.nonPlayerPlaces["deck"].cards[0].id;
  const handIndex = 0;
  const transitionType = "drawCard";
  const newTransition = buildTransition(cardId, transitionType, deckId, originIndex, handId, handIndex, state);
  dispatch({
    type: "DRAW_CARD",
    payload: { player: player, handId: handId },
  });
  dispatch({ type: "CHANGE_NUM_DRAWS", payload: -1 });
  dispatch(addTransition(newTransition));
};

export const addDraggedThunk = (source: DraggableLocation, destination: DraggableLocation) => (dispatch: Function, getState: Function) => {
  console.log("add dragged");
  dispatch({ type: "ADD_DRAGGED", payload: { source: source, destination: destination } });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  
};
