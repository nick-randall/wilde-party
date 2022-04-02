import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import GhostCard from "./GhostCard";
import { RootState } from "./redux/store";

interface SpecialsCardsColumnProps {
  cards: GameCard[];
  dimensions: AllDimensions;
  specialsZoneId: string;
  columnIndex: number;
}

export const SpecialsCardsColumn = (props: SpecialsCardsColumnProps) => {
  const { cards, dimensions, specialsZoneId, columnIndex } = props;
  const highlights = useSelector((state: RootState) => state.highlights);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const specialsColumnType = cards[0].specialsCardType;

  // Represents the next index where a new card of this special type will be inserted;
  const specialsColumnId = columnIndex + specialsZoneId;
  const isHighlighted = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType === specialsColumnType;
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === specialsColumnId && isHighlighted);
  const cardsNotAmongHighlights = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType !== specialsColumnType;
  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  const allowDropping = isHighlighted;

  return (
    <Draggable draggableId={specialsColumnId + "draggableId"} index={columnIndex} isDragDisabled={true}>
      {provided => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div style={{ width: dimensions.cardLeftSpread, height: dimensions.cardHeight }}>
            <div style={{ position: "relative" }}>
              {cards.map((card, index) => (
                <Card
                  index={card.index}
                  id={card.id}
                  image={card.image}
                  dimensions={dimensions}
                  key={card.id}
                  offsetTop={index * dimensions.cardTopSpread}
                  placeId={specialsZoneId}
                />
              ))}

              <Droppable droppableId={specialsColumnId} isDropDisabled={!allowDropping}>
                {provided => (
                  <div
                    // This is the drop box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      height: dimensions.cardHeight,
                      width: dimensions.cardWidth,
                      backgroundColor: isHighlighted ? "yellowgreen" : "",
                      boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
                      transition: "background-color 180ms, box-shadow 180ms, left 180ms",
                      position: "absolute",
                      top: cards.length * dimensions.cardTopSpread,
                    }}
                  >
                    {provided.placeholder}
                    {ghostCard ? <GhostCard image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
