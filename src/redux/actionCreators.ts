import { DrawCard } from "./actions";

// export const addTransition = (transitionData: TransitionData): AddTranstion => ({ type: "ADD_TRANSITION", payload: transitionData });

export const enactDrawCardEvent = (player: number, handId: string): DrawCard => ({
  type: "DRAW_CARD",
  payload: { player: player, handId: handId },
});

// export const sendEmissaryToDispatch = (id: string, dx: number, dy: number): SendEmissaryToDispatch => ({
//   type: "SEND_EMMISARY_TO_DISPATCH",
//   payload: { cardId: id, dx: dx, dy: dy },
// });

// export const sendEmissaryFromDispatch = (id: string, dx: number, dy: number): SendEmissaryFromDispatch => ({
//   type: "SEND_EMMISARY_FROM_DISPATCH",
//   payload: { cardId: id, dx: dx, dy: dy },
// });

