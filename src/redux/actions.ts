export const SetDRAGGED_CARD = "SetDraggedCard"



export type SetDraggedCard = {
  type: "SET_DRAGGED_CARD";
  payload: GameCard;
};

export type SetDraggedCardData = {
  type: "SET_DRAGGED_CARD_DATA";
  payload: {
    card: GameCard,
    cardRef: React.RefObject<HTMLImageElement>,
    //handElement: HTMLDivElement
  };
};

export type SetRearrangingDragGroupData = {
  type: "SET_REARRANGING_DRAG_GROUP_DATA"
  payload: RearrangingDragGroupData;
}

export type SetRearrangingCardsData = {
  type: "SET_REARRANGING_CARDS_DATA",
  payload: NewestRearrangingData
}

export type UpdateDraggedOverIndex = {
  type: "UPDATE_DRAGGED_OVER_INDEX",
  payload: number;
}

export type Rearrange = {
  type: "UPDATE_REARRANGE";
  payload: { draggedCards: GameCard[]; newIndex: number };
};

export type RemoveTransition = {
  type: "REMOVE_TRANSITION",
  payload: string;
}

export type EndRearrange = {
  type: "END_REARRANGE"
}

export type Action = SetDraggedCard | SetDraggedCardData | Rearrange | RemoveTransition | SetRearrangingCardsData | UpdateDraggedOverIndex | EndRearrange;
