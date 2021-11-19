import { useState } from "react";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { DraggedCardData } from "./useDragEvents";

const useCardTransitions = (gameSnapshot: GameSnapshot) => {
  const [cardTransitions, setCardTransitions] = useState<TransitionData[]>([]);

  const setUndraggedCardReturnTransition = (dragEvent: MouseEvent, draggedCardsData: DraggedCardData[], dropZoneElement: HTMLElement) => {
    setCardTransitions((prevState) => {
      const newState = [...prevState];

      const totalWait =
        newState.length === 0 ? 0 : newState.map((cardTransition) => cardTransition.duration).reduce((acc: number, curr: number) => acc + curr);

      draggedCardsData.forEach((card) => {
        const { offsetLeft, offsetTop } = dropZoneElement;
        const { cardHeight, cardWidth, draggedCardScale } = getAllDimensions(card.card.placeId);
        newState.push({
          card: card.card,
          origin: {
            top: dragEvent.clientY - card.offsetY - offsetTop - 140,
            left: dragEvent.clientX - card.offsetX - offsetLeft -8 ,
            height: cardHeight * draggedCardScale,
            width: cardWidth * draggedCardScale,
          },
          duration: 250,
          curve: "ease-in-out",
          animation: null,
          wait: totalWait,
        });
      });
      return newState;
    });
  };

  const setRearrangeCardsTransition = (
    dragEvent: MouseEvent,
    draggedCardsData: DraggedCardData[],
    draggedCards: CardGroup,
    newIndex: number,
    dropZoneElement: HTMLElement
  ) => {
    setCardTransitions((prevState) => {
      const newState = [...prevState];

      const totalWait =
        newState.length === 0 ? 0 : newState.map((cardTransition) => cardTransition.duration).reduce((acc: number, curr: number) => acc + curr);
        const minIndex = Math.min(...draggedCards.map(card => card.index))
      draggedCardsData.forEach((card) => {
        const { offsetTop } = dropZoneElement;
        const { cardHeight, cardWidth, cardLeftSpread, draggedCardScale } = getAllDimensions(card.card.placeId);
        const draggedCard = draggedCards.find((draggedcard) => draggedcard.id === card.card.id);
        if (draggedCard) {
          const indexDelta = draggedCard.index === minIndex ?  newIndex - draggedCard.index : newIndex-draggedCard.index +1;
          newState.push({
            card: card.card,
            origin: {
              top: dragEvent.clientY - card.offsetY -  offsetTop - 140, // why -140 ?
              left: dragEvent.clientX - card.offsetX - indexDelta * cardLeftSpread -8,
              height: cardHeight * draggedCardScale,
              width: cardWidth * draggedCardScale,
            },
            duration: 250,
            curve: "ease-in-out",
            animation: null,
            wait: totalWait,
          });
        }
      });
      return newState;
    });
  };
  const endTransition = (cardId: string) => {
    setCardTransitions((prevState) => {
      const newState = [...prevState];
      const cardArray = newState.find((array) => array.card.id === cardId);
      if (cardArray) newState.splice(newState.indexOf(cardArray, 1));
      return newState;
    });
  };
  return { cardTransitions, setUndraggedCardReturnTransition, endTransition, setRearrangeCardsTransition };
};

export default useCardTransitions;
