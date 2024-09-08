import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";

interface SpecialsCardsColumnProps {
  cards: GameCard[];
  cardType: GuestCardType;
  dimensions: AllDimensions;
  specialsZoneId: number;
  startingIndex: number;
  columnIndex: number;
}

export const SpecialsCardsColumn: React.FC<SpecialsCardsColumnProps> = ({
  cards,
  dimensions,
  cardType,
  columnIndex,
  specialsZoneId,
  startingIndex,
}) => {
  const { highlights, draggedHandCard, draggedOver } = useSelector((state: RootState) => state.dragEventState);
  const specialsColumnType = cards[0].specialsCardType;

  const draggableData: DraggableData = {
    type: "cardGroup",
    id: cards[0].id,
  };

  const droppableData: DroppableData = {
    type: "place",
    id: specialsZoneId,
    calculatedIndex: startingIndex,
  };

  const draggableId = JSON.stringify(draggableData);
  const droppableId = JSON.stringify(droppableData);

  const isHighlighted = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType === specialsColumnType;
  const isDraggedOver = isHighlighted && draggedOver?.id === specialsZoneId && draggedOver?.index === startingIndex;
  const cardsNotAmongHighlights = highlights.includes(specialsZoneId) && draggedHandCard?.specialsCardType !== specialsColumnType;
  const ghostCard = draggedHandCard && isDraggedOver ? draggedHandCard : undefined;
  const allowDropping = isHighlighted;

  return (
    <Draggable draggableId={draggableId} index={columnIndex} isDragDisabled={true}>
      {provided => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div style={{ width: dimensions.cardLeftSpread, height: dimensions.cardHeight }}>
            <div style={{ position: "relative" }}>
              {cards.map((card, index) => (
                <Card
                  index={card.index}
                  id={card.id}
                  imageName={card.imageName}
                  dimensions={dimensions}
                  key={card.id}
                  offsetTop={index * dimensions.cardTopSpread}
                />
              ))}
              {/* This👇 is the drop box */}
              <Droppable droppableId={droppableId} isDropDisabled={!allowDropping}>
                {provided => (
                  <div
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
                    {ghostCard ? <GhostCard index={0} imageName={ghostCard.imageName} dimensions={dimensions} zIndex={9} /> : null}
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
