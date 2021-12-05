import { divide } from "ramda";
import { Droppable } from "react-beautiful-dnd";
import Card from "./Card";

interface SpecialsCardsColumnProps {
  cards: GameCard[];
  dimensions: AllDimensions;
  specialsZoneId: string;
}

export const SpecialsCardsColumn = (props: SpecialsCardsColumnProps) => {
  const { cards, dimensions, specialsZoneId } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}>
      {cards.map(card => (
        <div style={{ height: 30 }}>
          <Card index={card.index} id={card.id} image={card.image} dimensions={dimensions} key={card.id} />
        </div>
      ))}
      <div
        style={{ height: 30 }}
        // Container
      >
        <Droppable droppableId={specialsZoneId + cards[0].index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                zIndex: 9,
                height: dimensions.cardHeight,
                width: dimensions.cardWidth,
                backgroundColor: snapshot.isDraggingOver ? "blue" : "",
                position: "absolute",
              }}
            />
          )}
        </Droppable>
      </div>
    </div>
  );
};
