import React, { useState, useCallback } from "react";
import { getDropZoneId } from "../helperFunctions/findDropZone";

export interface DraggedCardData {
  card: GameCard;
  translateX: number;
  translateY: number;
  offsetX: number;
  offsetY: number;
  placeRef: HTMLElement;
}

export interface DraggedOverData {
  id: string;
  positionX: number;
  positionY: number;
  offsetX: number;
  offsetY: number;
}

export const useDragEvents = (gameSnapshot: GameSnapshot) => {
  const [draggedCard, setDraggedCard] = useState<GameCard>();
  const [draggedCardData, setDraggedCardData] = useState<DraggedCardData>();
  const [draggedOverElement, setDraggedOverElement] = useState<DraggedOverData | null>(null);
  const [legalTargets, setLegalTargets] = useState<LegalTarget[]>([]);
  const [rearrangingCards, setRearrangingCards] = useState<GameCard[]>([]);
  const [rearrangingCardsData, setRearrangingCardsData] = useState<DraggedCardData[]>([]);

  const handleDragStart = (draggedCard: GameCard, cardRefs: Refs, placeRefs: Refs, mouseEvent: React.MouseEvent) => {
    mouseEvent.preventDefault();
    setDraggedCardData((prev) => {
      const draggedCardElement = cardRefs[draggedCard.id];
      const { left, top } = draggedCardElement.getBoundingClientRect();
      const { offsetLeft, offsetTop } = draggedCardElement;
      return {
        card: draggedCard,
        offsetX: offsetLeft + (mouseEvent.clientX - left),
        offsetY: offsetTop + (mouseEvent.clientY - top),
        translateX: left - offsetLeft,
        translateY: top - offsetTop,
        placeRef: placeRefs[getDropZoneId(draggedCard.placeId, gameSnapshot)],
      };
    });
    setDraggedCard(draggedCard);
  };

  const handleRearrangeStart = (rearrangingCards: CardGroup, cardRefs: Refs, placeRefs: Refs, mouseEvent: React.MouseEvent) => {
    mouseEvent.preventDefault();
    setRearrangingCardsData(
      rearrangingCards
        .filter((a) => a.cardType !== "fillCard")
        .map<DraggedCardData>((draggedCard) => {
          const draggedCardElement = cardRefs[draggedCard.id];
          const { left, top } = draggedCardElement.getBoundingClientRect();
          const { offsetLeft, offsetTop } = draggedCardElement;
          return {
            card: draggedCard,
            offsetX: offsetLeft + (mouseEvent.clientX - left),
            offsetY: offsetTop + (mouseEvent.clientY - top),
            translateX: left - offsetLeft,
            translateY: top - offsetTop,
            placeRef: placeRefs[getDropZoneId(draggedCard.placeId, gameSnapshot)],
          };
        })
    );
    setRearrangingCards(rearrangingCards);
  };

  const handleDragLeave = useCallback(
    (dragOverEvent: MouseEvent) => {
      if (draggedCard) {
        //const id = (dragOverEvent.target as HTMLElement).id;
        setDraggedOverElement(null);
      }
    },
    [draggedCard]
  );

  React.useEffect(() => {
    //window.addEventListener("mouseover", handleDraggedOver);
    window.addEventListener("mouseout", handleDragLeave);

    return () => {
      // window.removeEventListener("mouseover", handleDraggedOver);
      window.removeEventListener("mouseout", handleDragLeave);
    };
  }, [/*handleDraggedOver,*/ handleDragLeave]);

  return {
    draggedCard,
    draggedCardData,
    handleDragStart,
    handleRearrangeStart,
    setRearrangingCards,
    rearrangingCards,
    setRearrangingCardsData,
    rearrangingCardsData,
    setDraggedCard,
    setDraggedCardData,
    draggedOverElement,
    legalTargets,
  };
};
