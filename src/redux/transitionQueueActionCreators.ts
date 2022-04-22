

type AddTransition = { type: "ADD_TRANSITION", payload: TransitionData }

type UpdateTransitionTemplate = { type: "UPDATE_TRANSITION_TEMPLATE", payload: TransitionTemplate }

type RemoveTransition = {  type: "REMOVE_TRANSITION";  payload: string; };

type SetNewGameSnapshots = { type: "SET_NEW_GAME_SNAPSHOTS"; payload: NewSnapshot[] }

export const removeTransition = (transitionId: string) : RemoveTransition => ({type: "REMOVE_TRANSITION", payload: transitionId}) 

export const addTransition = (newTransitionData: TransitionData): AddTransition => ({ type: "ADD_TRANSITION", payload: newTransitionData });

export const updateTransitionTemplate = (template: TransitionTemplate): UpdateTransitionTemplate => ({ type: "UPDATE_TRANSITION_TEMPLATE", payload: template });

export const setNewGameSnapshots = (newSnapshots: NewSnapshot[]): SetNewGameSnapshots => ({type: "SET_NEW_GAME_SNAPSHOTS", payload: newSnapshots}) 

export type TransitionQueueActions = AddTransition | RemoveTransition |  UpdateTransitionTemplate | SetNewGameSnapshots