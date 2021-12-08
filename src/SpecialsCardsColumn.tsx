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
  //

  const specialsColumnLastIndex = cards[cards.length - 1].index;
  // Represents the next index where a new card of this special type will be inserted;
  const specialsColumnId = specialsZoneId + (specialsColumnLastIndex + 1);
  const isHighlighted = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType === specialsColumnType;
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === specialsColumnId && isHighlighted);
  const cardsNotAmongHighlights = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType !== specialsColumnType;
  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  const allowDropping = isHighlighted;

  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth}} >
    <Draggable index={columnIndex} draggableId={specialsColumnId + "draggable" + columnIndex}>
      {provided => (
        <div
          style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div style={{ height: 30, width: dimensions.cardWidth }} />
          {cards.map(card => (
            <div style={{ height: 30 }}>
              <Card
                index={card.index}
                id={card.id}
                image={card.image}
                dimensions={dimensions}
                key={card.id}
                //showNotAmongHighlights={cardsNotAmongHighlights}
              />
            </div>
          ))}
          <Droppable droppableId={specialsColumnId} isDropDisabled={!allowDropping}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  height: dimensions.cardHeight + 30 * cards.length + 30,
                  width: dimensions.cardWidth,
                  backgroundColor: isHighlighted ? "yellowgreen" : "",
                  boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
                  transition: "background-color 180ms, box-shadow 180ms, left 180ms",
                  position: "absolute",
                  bottom: -dimensions.cardHeight + 30,
                }}
              >
                {provided.placeholder}
                {ghostCard ? <GhostCard index={0} image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
    </div>
  );
};
