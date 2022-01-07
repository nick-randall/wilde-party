import { buildTransition } from "../dimensions/buildTransition";
import { AddTranstion, DrawCard } from "./actions";

export const addTransition = (transitionData: TransitionData): AddTranstion => ({ type: "ADD_TRANSITION", payload: transitionData });

export const enactDrawCardEvent = (player: number): DrawCard => ({
  type: "DRAW_CARD",
  payload: player,
});
