import { buildTransitionFromChanges } from "../animations/findChanges.ts/buildTransitionFromChanges";
import { addTransition } from "../redux/actionCreators";
import { RootState } from "../redux/store";

export const dealInitialHands = () => (dispatch: Function, getState: () => RootState) => {
  const numCardsInHand = 7;
  const numPlayers = getState().gameSnapshot.players.length;
  const delayBetweenCards = 300;
  const delayBetweenPlayers = 2300;
  const { gameSnapshot } = getState();

  const dealStartingGuest = (player: number) => {
    const prevSnapshot = getState().gameSnapshot;
    const transitionData = getState().transitionData;
    if (transitionData.length < 1) {
      dispatch({ type: "DEAL_STARTING_GUEST", payload: player });
      const newSnapshot = getState().gameSnapshot;
      const newTransition = buildTransitionFromChanges({ prevSnapshot, newSnapshot }, "drawCard", 0);
      dispatch(addTransition(newTransition));
    } else {
      setTimeout(() => dealStartingGuest(player), 10);
    }
  };


  const dealCard = (player: number, finalCard: boolean) => {
    const handId = gameSnapshot.players[player].places.hand.id;
    const prevSnapshot = getState().gameSnapshot;
    const transitionData = getState().transitionData;

    if (transitionData.length < 1) {
      dispatch({
        type: "DRAW_CARD",
        payload: { player: player, handId: handId },
      });
      const newSnapshot = getState().gameSnapshot;
      const newTransition = buildTransitionFromChanges({ prevSnapshot, newSnapshot }, "drawCard", 0);
      dispatch(addTransition(newTransition));
      if (finalCard) dispatch({ type: "END_CURRENT_PHASE" });
    } else setTimeout(() => dealCard(player, finalCard), 50);
  };

  for (let i = 0; i < numPlayers; i++) dealStartingGuest(i);
  for (let i = 0; i < numPlayers; i++) for (let j = 0; j < numCardsInHand; j++) dealCard(i, i * j === (numCardsInHand - 1) * (numPlayers - 1));
  // for (let i = 0; i < numPlayers; i++) {
  //   const prevSnapshot = getState().gameSnapshot;

  //   dispatch({ type: "DEAL_STARTING_GUEST", payload: i });
  //   const newSnapshot = getState().gameSnapshot;
  //   const newTransition = buildTransitionFromChanges({ prevSnapshot, newSnapshot }, "drawCard", i * delayBetweenPlayers);
  //   dispatch(addTransition(newTransition));
  // }
  //   for (let i = 0; i < numPlayers; i++) {
  //     const handId = gameSnapshot.players[i].places.hand.id;
  //     for (let j = 0; j < numCardsInHand; j++) {
  //       const prevSnapshot = getState().gameSnapshot;
  //       dispatch({
  //         type: "DRAW_CARD",
  //         payload: { player: i, handId: handId },
  //       });
  //       const newSnapshot = getState().gameSnapshot;
  //       const newTransition = buildTransitionFromChanges({ prevSnapshot, newSnapshot }, "drawCard", i * delayBetweenPlayers + j * delayBetweenCards);
  //       console.log(newTransition);

  //       dispatch(addTransition(newTransition));
  //     }
  //   }
};
