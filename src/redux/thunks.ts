import { locateCard } from "../helperFunctions/locateFunctions";
import { RootState } from "./store";

export const shouldEndTurn = (gameSnapshot: GameSnapshot) => gameSnapshot.current.draws < 1 && gameSnapshot.current.plays < 1;
export const shouldEndDrawPhase = (gameSnapshot: GameSnapshot) => gameSnapshot.current.draws < 1;

export const drawCardThunk = (player: number) => (dispatch: Function, getState: Function) => {
  const state: RootState = getState();
  const { gameSnapshot } = state.dragEventState;

  const handId = gameSnapshot.players[player].places.hand.id;
  dispatch({
    type: "DRAW_CARD",
    payload: { player: player, handId: handId },
  });
  dispatch({ type: "CHANGE_NUM_DRAWS", payload: -1 });

  if (shouldEndDrawPhase(getState().dragEventState.gameSnapshot)) dispatch({ type: "END_CURRENT_PHASE" });
  if (shouldEndTurn(getState().dragEventState.gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const addDraggedThunk = (source: DraggedOverData, destination: DraggedOverData) => (dispatch: Function, getState: () => RootState) => {
  const state = getState();
  const { gameSnapshot } = state.dragEventState;
  const { placeType: originPlace, player: originPlayer } = locateCard(source.id, gameSnapshot);
  let playedCard: GameCard | null = null;
  if (originPlayer && originPlace) playedCard = gameSnapshot.players[originPlayer].places[originPlace].cards[destination.index];
  dispatch({ type: "ADD_DRAGGED", payload: { source: source, destination: destination } });
  dispatch({ type: "CHANGE_NUM_PLAYS", payload: -1 });

  if (originPlayer !== 0 && playedCard && playedCard.card !== "unwanted") {
    locateCard(destination.id, gameSnapshot);
    console.log("origin player !=0");
  }

  console.log(shouldEndTurn(getState().dragEventState.gameSnapshot) ? "should end turn" : "should not end turn");
  if (shouldEndTurn(getState().dragEventState.gameSnapshot)) dispatch(endCurrentTurnThunk());
};

export const endCurrentTurnThunk = () => (dispatch: Function, getState: () => RootState) => {
  dispatch({ type: "END_CURRENT_TURN" });
  const { gameSnapshot } = getState().dragEventState;
  console.log("turn ended");
  // TODO: change back to allow player 0 to play
  if (gameSnapshot.current.player !== 0) {
    //dispatch({ type: "ENACT_AI_PLAYER_TURN", payload: gameSnapshot.current.player });
    // dispatch(enactAiPlayerTurnThunk(gameSnapshot.current.player));
  }
};
