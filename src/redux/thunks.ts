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
import { cleverGetNextAiCard } from "./ai/getNextAiCard";
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
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const addDraggedThunk = (source: LocationData, destination: LocationData) => (dispatch: Function, getState: () => RootState) => {
  const state = getState();
  const { gameSnapshot } = state;
  const { place: originPlace, player: originPlayer } = locate(source.droppableId, gameSnapshot);

  dispatch({ type: "ADD_DRAGGED", payload: { source: source, destination: destination } });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  const newSnapshot = getState().gameSnapshot;
  if (originPlayer !== 0) {
    const newTransition = buildTransitionFromChanges({ prevSnapshot: gameSnapshot, newSnapshot: newSnapshot }, "drawCard", state);
    console.log(newTransition)
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

export const enchantThunk = (dropResult: DropResult) => (dispatch: Function, getState: () => RootState) => {
  dispatch({ type: "ENCHANT", payload: dropResult });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });
  if (shouldEndTurn(getState().gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const endCurrentTurnThunk = () => (dispatch: Function, getState: () => RootState) => {
  dispatch({ type: "END_CURRENT_TURN" });
  const { gameSnapshot } = getState();
  if (gameSnapshot.current.player !== 0)
    //dispatch({ type: "ENACT_AI_PLAYER_TURN", payload: gameSnapshot.current.player });
    dispatch(enactAiPlayerTurnThunk(gameSnapshot.current.player));
};

export const enactAiPlayerTurnThunk = (player: number) => (dispatch: Function, getState: () => RootState) => {
  let { gameSnapshot } = getState();
  let { draws } = gameSnapshot.current;
  let numCardsInDeck = gameSnapshot.nonPlayerPlaces.deck.cards.length;
  // setTimeout(() => {
  while (draws > 0 && numCardsInDeck > 0) {
    dispatch(drawCardThunk(player));
    const { gameSnapshot } = getState();
    draws = gameSnapshot.current.draws;
    numCardsInDeck = gameSnapshot.nonPlayerPlaces.deck.cards.length;
  }
  // }, 1000);
  gameSnapshot = getState().gameSnapshot;
  const randomCard = cleverGetNextAiCard(player, gameSnapshot);
  if (randomCard === undefined) dispatch(endCurrentTurnThunk());
  else {
    const potentialTargets = getHighlights(randomCard, gameSnapshot);
    if (potentialTargets.length > 0) {
      const hand = gameSnapshot.players[player].places.hand;

      // should choose a random target, currently just getting target[0]

      const action = randomCard.action;
      switch (action.actionType) {
        case "addDragged": {
          console.log(hand.id, randomCard);
          dispatch(
            addDraggedThunk(
              { droppableId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
              { droppableId: potentialTargets[0], index: 0 }
            )
          );
        }
      }
    }
    console.log(potentialTargets);
  }
  console.log(randomCard);
};
