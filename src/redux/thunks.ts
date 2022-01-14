import { ThunkDispatch } from "@reduxjs/toolkit";
import produce from "immer";
import { DropResult } from "react-beautiful-dnd";
import { buildTransitionFromChanges } from "../animations/findChanges.ts/buildTransitionFromChanges";
import { findChanges } from "../animations/findChanges.ts/findChanges";
import { buildTransition } from "../dimensions/buildTransition";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { locate } from "../helperFunctions/locateFunctions";
import { addTransition } from "./actionCreators";
import { LocationData } from "./actions";
import { cleverGetNextAiCard } from "../ai/getNextAiCard";
import { RootState } from "./store";
import enactAiPlayerTurnThunk from "../thunks/enactAiPlayerTurnThunk";

export const shouldEndTurn = (gameSnapshot: GameSnapshot) => gameSnapshot.current.draws < 1 && gameSnapshot.current.plays < 1;

export const drawCardThunk = (player: number) => (dispatch: Function, getState: Function) => {
  const state: RootState = getState();
  const { gameSnapshot } = state;

  const deckId = gameSnapshot.nonPlayerPlaces["deck"].id;
  const originIndex = 0;
  const handId = gameSnapshot.players[player].places.hand.id;
  const cardId = gameSnapshot.nonPlayerPlaces["deck"].cards[0].id;
  const handIndex = 0;
  const transitionType = "drawCard";
  const newTransition = buildTransition(cardId, transitionType, 0, deckId, originIndex, handId, handIndex, state);
  dispatch({
    type: "DRAW_CARD",
    payload: { player: player, handId: handId },
  });
  dispatch({ type: "CHANGE_NUM_DRAWS", payload: -1 });
  console.log(newTransition);

  dispatch(addTransition(newTransition));
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const addDraggedThunk = (dropResult: DropResultEvent) => (dispatch: Function, getState: () => RootState) => {
  const state = getState();
  const { gameSnapshot } = state;
  const {source, destination} = dropResult;
  const { place: originPlace, player: originPlayer } = locate(source.droppableId, gameSnapshot);

  dispatch({ type: "ADD_DRAGGED", payload: { source: source, destination: destination } });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  const newSnapshot = getState().gameSnapshot;
  if (originPlayer !== 0) {
    const newTransition = buildTransitionFromChanges({ prevSnapshot: gameSnapshot, newSnapshot: newSnapshot }, "drawCard", 0, state);
    console.log(newTransition);
    dispatch(addTransition(newTransition));
    // console.log(originPlayer)
    // if (originPlayer !== null && originPlace !== null) {
    //   const cardId = gameSnaphot.players[originPlayer].places[originPlace].cards[source.index];
    //   const newTransition = buildTransition(cardId, "drawCard", source.droppableId, source.index, destination.droppableId, destination.index, state);
    //   dispatch(addTransition(newTransition));
    // }
  }
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const enchantThunk = (dropResult: DropResultEvent) => (dispatch: Function, getState: () => RootState) => {
  console.log("enchant thunk", dropResult)
  dispatch({ type: "ENCHANT", payload: dropResult });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  console.log(getState().gameSnapshot.players[0].places.enchantmentsRow.cards)
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const endCurrentTurnThunk = () => (dispatch: Function, getState: () => RootState) => {
  dispatch({ type: "END_CURRENT_TURN" });
  const { gameSnapshot } = getState();
  console.log("turn ended");
  if (gameSnapshot.current.player !== 0)
    //dispatch({ type: "ENACT_AI_PLAYER_TURN", payload: gameSnapshot.current.player });
    dispatch(enactAiPlayerTurnThunk(gameSnapshot.current.player));
};
