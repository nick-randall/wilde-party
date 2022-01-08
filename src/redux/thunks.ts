import { ThunkDispatch } from "@reduxjs/toolkit";
import produce from "immer";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { buildTransition } from "../dimensions/buildTransition";
import { addTransition } from "./actionCreators";
import { RootState } from "./store";

const shouldEndTurn = (gameSnapshot: GameSnapshot) => gameSnapshot.current.draws < 1 && gameSnapshot.current.plays < 1;


export const drawCardThunk = (player: number) => (dispatch: Function, getState: Function) => {
  const state: RootState = getState();
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
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk())
};

export const addDraggedThunk = (source: DraggableLocation, destination: DraggableLocation) => (dispatch: Function, getState: Function) => {
  dispatch({ type: "ADD_DRAGGED", payload: { source: source, destination: destination } });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk())
};

export const enchantThunk = (dropResult: DropResult) => (dispatch: Function, getState: () => RootState) => {
  dispatch({ type: "ENCHANT", payload: dropResult });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk())
};

export const endCurrentTurnThunk = () => (dispatch: Function, getState: () => RootState) => {
  const { gameSnapshot } = getState();
  dispatch({type: "END_CURRENT_TURN"})
 
};
