export type UiGameCard = GameCard & {
  cardElementDisplayType: CardElementDisplayType;
};

export type CardElementDisplayType = "placeholder" | "mockToRender" | "mockFromRender" | "card";