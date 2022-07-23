type AddTransition = { type: "ADD_TRANSITION"; payload: TransitionData };

type AddMultipleTransitions = { type: "ADD_MULTIPLE_TRANSITIONS"; payload: TransitionData[] };

type AddAnimation = { type: "ADD_ANIMATION"; payload: AnimationData };

type AddMultipleAnimations = { type: "ADD_MULTIPLE_ANIMATIONS"; payload: AnimationData[] };

type SetAnimationTemplates = { type: "SET_ANIMATION_TEMPLATES"; payload: AnimationTemplate[][] };

type AddScreenDataToTemplate = { type: "ADD_SCREEN_DATA_TO_TEMPLATE"; payload: AnimationTemplate };

type EndAnimationTemplateNewVersion = { type: "END_ANIMATION_TEMPLATE_NEW_VERSION"; payload: AnimationTemplate };

type EndAnimationTemplateGroup = { type: "END_ANIMATION_TEMPLATE_GROUP" };

type RemoveTransition = { type: "REMOVE_TRANSITION"; payload: string };

type RemoveAnimation = { type: "REMOVE_ANIMATION"; payload: string };

type ClearAnimationTemplates = { type: "CLEAR_ANIMATION_TEMPLATES" };

export type AddMultipleAnimationsNewVersion = { type: "ADD_MULTIPLE_ANIMATIONS_NEW_VERSION"; payload: AnimationData[] };

export const addMultipleAnimationsNewVersion = (animationData: AnimationData[]): AddMultipleAnimationsNewVersion => ({
  type: "ADD_MULTIPLE_ANIMATIONS_NEW_VERSION",
  payload: animationData,
});
type CreateAnimationsFromTemplates = {
  type: "CREATE_ANIMATIONS_FROM_TEMPLATES",
  payload: CompleteAnimationTemplate[],
};

export type CreateNewAnimations = { type: "CREATE_NEW_ANIMATIONS" };


export const removeTransition = (transitionId: string): RemoveTransition => ({ type: "REMOVE_TRANSITION", payload: transitionId });

export const removeAnimation = (cardId: string): RemoveAnimation => ({ type: "REMOVE_ANIMATION", payload: cardId });

export const endAnimationTemplateGroup = (): EndAnimationTemplateGroup => ({ type: "END_ANIMATION_TEMPLATE_GROUP" });
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

export const clearAnimationTemplates = (): ClearAnimationTemplates => ({ type: "CLEAR_ANIMATION_TEMPLATES" });

export const createAnimationsFromTemplates = (templates: CompleteAnimationTemplate[]): CreateAnimationsFromTemplates => ({
  type: "CREATE_ANIMATIONS_FROM_TEMPLATES",
  payload: templates,
});

export const addScreenDataToTemplate = (template: AnimationTemplate): AddScreenDataToTemplate => ({
  type: "ADD_SCREEN_DATA_TO_TEMPLATE",
  payload: template,
});

export const endAnimationTemplateNewVersion = (template: AnimationTemplate): EndAnimationTemplateNewVersion => ({
  type: "END_ANIMATION_TEMPLATE_NEW_VERSION",
  payload: template,
});

export const setAnimationTemplates = (animationTemplates: AnimationTemplate[][]): SetAnimationTemplates => ({
  type: "SET_ANIMATION_TEMPLATES",
  payload: animationTemplates,
});

export type TransitionQueueActions =
  | AddTransition
  | AddMultipleTransitions
  | RemoveTransition
  | CreateNewAnimations
  | EndAnimationTemplateGroup
  | EndAnimationTemplateNewVersion;
