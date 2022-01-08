import { buildTransition } from "../dimensions/buildTransition";
import { AddTranstion, DrawCard } from "./actions";

export const addTransition = (transitionData: TransitionData): AddTranstion => ({ type: "ADD_TRANSITION", payload: transitionData });

export const enactDrawCardEvent = (player: number, handId: string): DrawCard => ({
  type: "DRAW_CARD",
  payload: {player: player, handId: handId},
});
