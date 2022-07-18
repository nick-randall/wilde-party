import { flatten } from "ramda";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { EmptySpecialsColumn } from "./EmptySpecialsColumn";
import GhostCard from "./GhostCard";
import { getDimensions } from "./helperFunctions/getDimensions";
import { getSpecialsOfType, sortSpecials2 } from "./helperFunctions/getSpecialsOfType";
import { RootState } from "./redux/store";
import { SpecialsCardsColumn } from "./SpecialsCardsColumn";

interface SpecialsZoneProps {
  specialsCards: GameCard[];
  id: string;
  playerZoneSize: { width: number; height: number };
}

export const SpecialsZone: React.FC<SpecialsZoneProps> = (props: SpecialsZoneProps) => {
  const { specialsCards, id, playerZoneSize } = props;
  const dimensions = getDimensions(0, "specialsZone");
  const { cardWidth, cardHeight } = dimensions;
  const screenSize = useSelector((state: RootState) => state.screenSize);
  const { x, y } = getPlacesLayout(id, playerZoneSize);
  const isHighlighted = useSelector((state: RootState) => state.highlights.includes(id));
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);
  const specialsCardsColumns = sortSpecials2(specialsCards);
  const allSpecialsCardsTypes: GuestCardType[] = ["rumgroelerin", "saufnase", "schleckermaul", "taenzerin"];
  const specialsCardsTypes: (GuestCardType | undefined)[] = flatten(specialsCardsColumns.map(column => column[0].specialsCardType));
  const missingSpecialsCardsTypes = allSpecialsCardsTypes.filter(type => !specialsCardsTypes.includes(type));
  const allowDropping = isHighlighted && draggedHandCard?.specialsCardType && missingSpecialsCardsTypes.includes(draggedHandCard?.specialsCardType) ;
  const draggedOver = useSelector((state: RootState) => state.dragUpdate);
  const ghostCard = draggedOver.droppableId === id && draggedOver.index !== -1 ? draggedHandCard : undefined;

  // const allowDropping = rearranging;

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={!allowDropping}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: "flex",
            position: "absolute",
            margin:0,
            top: y,
            left: x,
            // flexDirection: "row",
            backgroundColor: allowDropping ? "yellowgreen" : "",
            boxShadow: allowDropping ? "0px 0px 30px 30px yellowgreen" : "",
            // transition: "background-color 180ms, box-shadow 180ms, left 180ms",
            width: specialsCardsColumns.length * cardWidth,
            minWidth: cardWidth,
            height: cardHeight,
            transition: "left 250ms",
          }}
        >
         
          {specialsCardsColumns.map((cards, index) => (
            <SpecialsCardsColumn cards={cards} columnIndex={index} dimensions={dimensions} key={cards[0].id + index} specialsZoneId={id} />
          ))}
           {/* {specialsCardsColumns.length < 4 ? (
            <EmptySpecialsColumn
              index={specialsCards.length}
              acceptedSpecialsTypes={missingSpecialsCardsTypes}
              specialsZoneId={id}
              dimensions={dimensions}
            />
          ) : null} */}
                    {ghostCard ? <GhostCard image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
