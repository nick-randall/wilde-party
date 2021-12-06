import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
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

  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}>
      <div style={{height: 30,width: dimensions.cardWidth}}>

      </div>
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
                zIndex: 9,
                height: dimensions.cardHeight + (30 * cards.length - 1 ),
                width: dimensions.cardWidth,
                backgroundColor: snapshot.isDraggingOver ? "blue" : "",
                //border: highlights.includes(specialsZoneId) ? "thick black solid" : "",
                border: isHighlighted ? "thick black solid": "",
                position: "absolute",
              }}
            >
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
