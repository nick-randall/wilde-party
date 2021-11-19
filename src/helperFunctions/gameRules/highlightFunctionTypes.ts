export type HighlightCardFunction = (highlightCard: GameCard, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean;

export type HighlightPlaceFunction = (highlightPlace: GamePlace, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean;

export type HighlightPlayerFunction = (highlightPlayer: GamePlayer, draggedCard: GameCard, gameSnapshot: GameSnapshot) => boolean;

export type HighlightFunctions = {
  [type: string]: HighlightCardFunction | HighlightPlaceFunction | HighlightPlayerFunction
};