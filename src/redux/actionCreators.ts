import { AddTranstion, DrawCard } from "./actions";

export const addTransition = (transitionData: TransitionData): AddTranstion => ({ type: "ADD_TRANSITION", payload: transitionData });

export const enactDrawCardEvent = (player: number, handId: string): DrawCard => ({
  type: "DRAW_CARD",
  payload: { player: player, handId: handId },
});

export const sendEmissaryDispatch = (id: string, xPosition: number, yPosition: number): SendEmissaryDispatch => ({
  type: "SEND_EMMISARY_DISPATCH",
  payload: { id: id, xPosition: xPosition, yPosition: yPosition },
});

