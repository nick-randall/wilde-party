import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";
import { forwardRef } from "react";
import { RefMap } from "../animations/animationHelperFunctions";

interface SpecialsCardsColumnProps {
  cards: GameCard[];
  cardType: GuestCardType;
  specialsZoneId: number;
  startingIndex: number;
  columnIndex: number;
  cardStyles: CardDimensions
}

export const SpecialsCardsColumn = forwardRef<RefMap, SpecialsCardsColumnProps>(({
  cards,
  cardStyles,
  cardType,
  columnIndex,
  specialsZoneId,
  startingIndex,
}, refMap) => {
  const { highlights, draggedHandCard, draggedOver } = useSelector((state: RootState) => state.dragEventState);

  const {currSnapshot} = useSelector((state: RootState) => state.gameSnapshotState);
    const specialsColumnType = cards[0].guestCardType;

  const draggableData: DraggableData = {
    type: "cardGroup",
    id: cards[0].id,
  };

  const droppableData: DroppableData = {
    type: "place",
    id: specialsZoneId,
    calculatedIndex: cards.length,
  };

  const draggableId = JSON.stringify(draggableData);
  const droppableId = JSON.stringify(droppableData);

  const isHighlighted = highlights.includes(specialsZoneId) && draggedHandCard?.guestCardType === specialsColumnType;
  console.log("isHighlighted", isHighlighted);
  console.log("highlights", highlights);
  console.log("specialsZoneId", specialsZoneId);
  console.log("draggedHandCard", draggedHandCard);
  console.log("specialsColumnType", specialsColumnType);
  console.log("draggedOver", draggedOver);
  console.log("startingIndex", startingIndex);
  const isDraggedOver = isHighlighted && draggedOver?.id === specialsZoneId && draggedOver?.index === startingIndex;
  const cardsNotAmongHighlights = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType !== specialsColumnType;
  const ghostCard = draggedHandCard && isDraggedOver ? draggedHandCard : undefined;
  const allowDropping = isHighlighted;

  return (
    <Draggable draggableId={draggableId} index={columnIndex} isDragDisabled={true}>
      {provided => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div style={{ width: cardStyles.left, height: cardStyles.cardHeight }}>
            <div style={{ position: "relative" }}>
              {cards.map((card, index) => (
                <Card
                  index={index}
                  id={card.id}
                  imageName={card.imageName}
                  key={card.id}
                  offsetTop={index * cardStyles.top}
                />
              ))}
              {/* This👇 is the drop box */}
              <Droppable droppableId={droppableId} isDropDisabled={!allowDropping}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      height: cardStyles.cardHeight,
                      width: cardStyles.cardWidth,
                      backgroundColor: isHighlighted ? "yellowgreen" : "",
                      boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
                      transition: "background-color 180ms, box-shadow 180ms, left 180ms",
                      position: "absolute",
                      top: cards.length * cardStyles.top,
                    }}
                  >
                    {provided.placeholder}
                    {ghostCard ? <GhostCard cardId={ghostCard.id} index={0} imageName={ghostCard.imageName} zIndex={9} /> : null}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});
