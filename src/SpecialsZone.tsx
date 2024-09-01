import R, { flatten, is } from "ramda";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import GhostCard from "./GhostCard";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";
import { SpecialsCardsColumn } from "./SpecialsCardsColumn";
import "./css/global.css";

interface SpecialsZoneProps {
  specialsZoneData: GamePlace;
  alignment: string;
}

type SpecialsColumnCards = {
  cardType: GuestCardType;
  cards: GameCard[];
  startingIndex: number;
};

const groupSpecialsColumns = (specialsCards: GameCard[]): SpecialsColumnCards[] => {
  const allSpecialsCardsTypes: GuestCardType[] = ["rumgroelerin", "saufnase", "schleckermaul", "taenzerin"];
  let startingIndex = 0;
  return allSpecialsCardsTypes.map(type => {
    const cards = specialsCards.filter(card => card.guestCardType === type);
    const column = {
      cards,
      startingIndex,
      cardType: type,
    };
    startingIndex += cards.length;
    return column;
  });
};

export const SpecialsZone: React.FC<SpecialsZoneProps> = ({ specialsZoneData:{id, cards}, alignment }) => {
  const droppableData: DroppableData = { type: "place", id };
  const droppableId = JSON.stringify(droppableData);

  const dimensions = getAllDimensions(id);
  const { cardWidth, cardHeight } = dimensions;
  const {draggedOver, draggedHandCard} = useSelector((state: RootState) => state);
  const isHighlighted = useSelector((state: RootState) => state.highlights.includes(id));
  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);
  const specialsCardsColumns = groupSpecialsColumns(cards); // R.groupWith<GameCard>((a, b) => a.specialsCardType === b.specialsCardType, specialsCards);
  const draggedSpecialsType = draggedHandCard?.specialsCardType;
  const allowDropping = isHighlighted && specialsCardsColumns.some(column => column.cardType === draggedSpecialsType && column.cards.length === 0);

  const ghostCard = draggedOver?.id === id && draggedOver.index !== -1 ? draggedHandCard : undefined;

  // const allowDropping = rearranging;

  return (
    <Droppable droppableId={droppableId} direction="horizontal" isDropDisabled={!allowDropping}>
      {provided => (
        <div
        className={`grid-item ${alignment} ${isHighlighted ? "highlighted" : ""}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: "flex",
            margin: 0,
            width: specialsCardsColumns.length * cardWidth,
            minWidth: cardWidth,
            height: cardHeight,
            transition: "left 250ms",
          }}
        >
          {specialsCardsColumns.map((column, index) =>
            column.cards.length === 0 ? null : (
              <SpecialsCardsColumn
                cards={column.cards}
                cardType={column.cardType}
                columnIndex={index}
                startingIndex={column.startingIndex}
                dimensions={dimensions}
                key={column.cards[0].id + index}
                specialsZoneId={id}
              />
            )
          )}
          {ghostCard ? <GhostCard index={draggedOver?.index ?? 0} image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
