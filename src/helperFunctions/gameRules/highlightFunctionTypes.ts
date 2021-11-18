export type HighlightCardFunction = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean;
export type HighlightCardFunctionsObj = Record<CardActionType, HighlightCardFunction>;

export type HighlightPlaceFunction = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean;
export type HighlightPlaceFunctionsObj = Record<PlaceActionType, HighlightPlaceFunction>;

export type HighlightPlayerFunction = (highlightPlayer: GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean;
export type HighlightPlayerFunctionsObj = Record<PlayerActionType, HighlightPlayerFunction>;

export type HighlightFunctionsObj = Record<HighlightType, HighlightCardFunctionsObj | HighlightPlaceFunctionsObj | HighlightPlayerFunctionsObj>; //Record<HighlightType, HighlightCardFunctionsObj | HighlightPlaceFunctionsObj | HighlightPlayerFunctionsObj>

export type HighlightFunctions = {
  [type: string]: HighlightCardFunction | HighlightPlaceFunction | HighlightPlayerFunction
};