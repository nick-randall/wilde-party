type AddTransition = { type: "ADD_TRANSITION"; payload: TransitionData };

type AddMultipleTransitions = { type: "ADD_MULTIPLE_TRANSITIONS"; payload: TransitionData[] };

type AddAnimation = { type: "ADD_ANIMATION"; payload: AnimationData };

type AddMultipleAnimations = { type: "ADD_MULTIPLE_ANIMATIONS"; payload: AnimationData[] };

type UpdateAnimationTemplate = { type: "UPDATE_ANIMATION_TEMPLATE"; payload: AnimationTemplate };

type SetAnimationTemplates = { type: "SET_ANIMATION_TEMPLATES"; payload: AnimationTemplateNewVersion[][] };

type UpdateAnimationTemplateNewVersion = { type: "UPDATE_ANIMATION_TEMPLATE_NEW_VERSION"; payload: AnimationTemplateNewVersion };

type UpdateTransitionTemplate = { type: "UPDATE_TRANSITION_TEMPLATE"; payload: TransitionTemplate };

type RemoveTransition = { type: "REMOVE_TRANSITION"; payload: string };

type RemoveAnimation = { type: "REMOVE_ANIMATION"; payload: string };

export type AddMultipleAnimationsNewVersion = { type: "ADD_MULTIPLE_ANIMATIONS_NEW_VERSION"; payload: AnimationData[] };

export const addMultipleAnimationsNewVersion = (animationData: AnimationData[]): AddMultipleAnimationsNewVersion => ({
  type: "ADD_MULTIPLE_ANIMATIONS_NEW_VERSION",
  payload: animationData,
});

export type CreateNewAnimations = { type: "CREATE_NEW_ANIMATIONS" };

type SetNewGameSnapshots = { type: "SET_NEW_GAME_SNAPSHOTS"; payload: NewSnapshot[] };

export const removeTransition = (transitionId: string): RemoveTransition => ({ type: "REMOVE_TRANSITION", payload: transitionId });

export const removeAnimation = (cardId: string): RemoveAnimation => ({ type: "REMOVE_ANIMATION", payload: cardId });

export const addTransition = (newTransitionData: TransitionData): AddTransition => ({ type: "ADD_TRANSITION", payload: newTransitionData });

export const addMultipleTransitions = (newTransitionData: TransitionData[]): AddMultipleTransitions => ({
  type: "ADD_MULTIPLE_TRANSITIONS",
  payload: newTransitionData,
});

export const addAnimation = (newAnimationData: AnimationData): AddAnimation => ({ type: "ADD_ANIMATION", payload: newAnimationData });

export const addMultipleAnimations = (newAnimationData: AnimationData[]): AddMultipleAnimations => ({
  type: "ADD_MULTIPLE_ANIMATIONS",
  payload: newAnimationData,
});

export const updateTransitionTemplate = (template: TransitionTemplate): UpdateTransitionTemplate => ({
  type: "UPDATE_TRANSITION_TEMPLATE",
  payload: template,
});

export const updateAnimationTemplate = (template: AnimationTemplate): UpdateAnimationTemplate => ({
  type: "UPDATE_ANIMATION_TEMPLATE",
  payload: template,
});

export const updateAnimationTemplateNewVersion = (template: AnimationTemplateNewVersion): UpdateAnimationTemplateNewVersion => ({
  type: "UPDATE_ANIMATION_TEMPLATE_NEW_VERSION",
  payload: template,
});

export const setAnimationTemplates = (animationTemplates: AnimationTemplateNewVersion[][]): SetAnimationTemplates => ({
  type: "SET_ANIMATION_TEMPLATES",
  payload: animationTemplates,
});

export const setNewGameSnapshots = (newSnapshots: NewSnapshot[]): SetNewGameSnapshots => ({ type: "SET_NEW_GAME_SNAPSHOTS", payload: newSnapshots });

export type TransitionQueueActions =
  | AddTransition
  | AddMultipleTransitions
  | RemoveTransition
  | UpdateTransitionTemplate
  | CreateNewAnimations
  | SetNewGameSnapshots;
