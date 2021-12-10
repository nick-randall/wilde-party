import { flatten } from "ramda";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { getLayout } from "./dimensions/getLayout";
import { EmptySpecialsColumn } from "./EmptySpecialsColumn";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getSpecialsOfType, sortSpecials2 } from "./helperFunctions/getSpecialsOfType";
import { RootState } from "./redux/store";
import { SpecialsCardsColumn } from "./SpecialsCardsColumn";

interface SpecialsZoneProps {
  specialsCards: GameCard[];
  id: string;
}

export const SpecialsZone: React.FC<SpecialsZoneProps> = (props: SpecialsZoneProps) => {
  const { specialsCards, id } = props;
  const dimensions = getAllDimensions(id);
  const { cardWidth, cardHeight } = dimensions;
  //const { x, y } = getLayout(id);
  const highlights = useSelector((state: RootState) => state.highlights);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);  
  const specialsCardsColumns = sortSpecials2(specialsCards);
  const allSpecialsCardsTypes: GuestCardType[] = ["rumgroelerin", "saufnase", "schleckermaul", "taenzerin"];
  const specialsCardsTypes: (GuestCardType | undefined)[] = flatten(specialsCardsColumns.map(column => column[0].specialsCardType));
  const missingSpecialsCardsTypes = allSpecialsCardsTypes.filter(type => !specialsCardsTypes.includes(type));

  const allowDropping = rearranging;


  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={!allowDropping}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: "flex",
            position: "absolute",
            // top: y,
            // left: x,
            flexDirection: "row",
            // backgroundColor: isHighlighted ? "yellowgreen" : "",
            // boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
            // transition: "background-color 180ms, box-shadow 180ms, left 180ms",
            width: specialsCardsColumns.length * cardWidth,
            height: cardHeight,
            transition: "left 250ms",
          }}
        >
          {specialsCardsColumns.map((cardColumns, index) => (
            <SpecialsCardsColumn cards={cardColumns}columnIndex={index} dimensions={dimensions} key={cardColumns[0].id} specialsZoneId={id} />
          ))}
          

          {specialsCardsColumns.length < 4 ? (
            <EmptySpecialsColumn
              index={specialsCards.length}
              acceptedSpecialsTypes={missingSpecialsCardsTypes}
              specialsZoneId={id}
              dimensions={dimensions}
            />
          ) : null}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
