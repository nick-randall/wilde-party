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
   <div style={{ display: "flex", flexDirection:"column-reverse"}}>

    <Droppable droppableId={specialsZoneId + cards[cards.length - 1].index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            zIndex: 9,
            height: dimensions.cardHeight + (30 * cards.length - 1),
            width: dimensions.cardWidth,
            border: highlights.includes(specialsZoneId) ? "thick red dotted" : "",
            backgroundColor: isHighlighted ? "yellowgreen" : "",
            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
            transition: "background-color 180ms, box-shadow 180ms, left 180ms",
          }}
        >
          <div>
        
          <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}>
            {cards.map(card => (
              <div style={{ height: 30 }}>
                <Card index={card.index} id={card.id} image={card.image} dimensions={dimensions} key={card.id} />
              </div>
            ))}
          </div></div>
        </div>
      )}
    </Droppable>
    </div>
  );
};
