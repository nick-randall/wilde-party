import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import GhostCard from "./GhostCard";
import { RootState } from "./redux/store";

interface SpecialsCardsColumnProps {
  cards: GameCard[];
  dimensions: AllDimensions;
  specialsZoneId: string;
}

export const SpecialsCardsColumn = (props: SpecialsCardsColumnProps) => {
  const { cards, dimensions, specialsZoneId } = props;
  const highlights = useSelector((state: RootState) => state.highlights);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const specialsColumnType = cards[0].specialsCardType;
  const isHighlighted = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType === specialsColumnType;
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId===specialsZoneId + cards[cards.length - 1].index);
  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;


  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}>
      <div style={{ height: 30, width: dimensions.cardWidth }}></div>
      {cards.map(card => (
        <div style={{ height: 30 }}>
          <Card index={card.index} id={card.id} image={card.image} dimensions={dimensions} key={card.id} />
        </div>
      ))}
      <div
      //style={{ height: 30 }}
      // Container
      >
        <Droppable droppableId={specialsZoneId + cards[cards.length - 1].index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                height: dimensions.cardHeight + 30 * cards.length,
                width: dimensions.cardWidth,
                backgroundColor: snapshot.isDraggingOver ? "blue" : "",
                //backgroundColor: isHighlighted ? "yellowgreen" : "",
                boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
                transition: "background-color 180ms, box-shadow 180ms, left 180ms",
                position: "absolute",
                bottom: -dimensions.cardHeight + 60,
              }}
            >
              {provided.placeholder}
              {ghostCard ? <GhostCard index={0} image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
