import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import GhostCard from "./GhostCard";
import { RootState } from "./redux/store";

interface EmptySpecialsColumnProps {
  acceptedSpecialsTypes: GuestCardType[];
  index: number;
  specialsZoneId: string;
  dimensions: AllDimensions;
}

export const EmptySpecialsColumn = (props: EmptySpecialsColumnProps) => {
  const { index, acceptedSpecialsTypes, specialsZoneId, dimensions } = props;
  const specialsColumnId = specialsZoneId + index;
  const { cardHeight, cardWidth } = dimensions;
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);

  const specialsZoneHighlighted = useSelector((state: RootState) => state.highlights.includes(specialsZoneId));
  const handCardSpecialsType = useSelector((state: RootState) => state.draggedHandCard?.specialsCardType);
  const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === specialsColumnId);

  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;

  const specialsTypeAccepted = handCardSpecialsType && acceptedSpecialsTypes.includes(handCardSpecialsType);

  const isHighlighted = specialsZoneHighlighted && specialsTypeAccepted;
  console.log(acceptedSpecialsTypes)
  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}>
      <Droppable droppableId={specialsColumnId} isDropDisabled={!isHighlighted}>
        {provided => (
          <div
            style={{
              height: cardHeight,
              width: cardWidth,
              position: "absolute",
              bottom: -cardWidth,

              border: "thin black dotted",
              backgroundColor: isHighlighted ? "yellowgreen" : "",
              boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
              transition: "background-color 180ms, box-shadow 180ms, left 180ms",
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {provided.placeholder}
            {ghostCard ? <GhostCard index={0} image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}
          </div>
        )}
      </Droppable>
    </div>
  );
};
