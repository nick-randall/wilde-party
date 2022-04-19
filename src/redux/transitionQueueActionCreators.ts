

type AddNewTransition = { type: "ADD_NEW_TRANSITION_DATA", payload: TransitionData }

type UpdateTransitionTemplate = { type: "UPDATE_TRANSITION_TEMPLATE", payload: TransitionTemplate }

export const addNewTransition = (newTransitionData: TransitionData): AddNewTransition => ({ type: "ADD_NEW_TRANSITION_DATA", payload: newTransitionData });

export const updateTransitionTemplate = (template: TransitionTemplate): UpdateTransitionTemplate => ({ type: "UPDATE_TRANSITION_TEMPLATE", payload: template });

export type TransitionQueueActions = AddNewTransition & UpdateTransitionTemplate