

type AddTransition = { type: "ADD_TRANSITION", payload: TransitionData }

type UpdateTransitionTemplate = { type: "UPDATE_TRANSITION_TEMPLATE", payload: TransitionTemplate }

export const addTransition = (newTransitionData: TransitionData): AddTransition => ({ type: "ADD_TRANSITION", payload: newTransitionData });

export const updateTransitionTemplate = (template: TransitionTemplate): UpdateTransitionTemplate => ({ type: "UPDATE_TRANSITION_TEMPLATE", payload: template });

export type TransitionQueueActions = AddTransition | UpdateTransitionTemplate