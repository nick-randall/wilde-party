import { useSelector } from "react-redux";
import { getLayout } from "./dimensions/getLayout";
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
  const { x, y } = getLayout(id);
  const highlights = useSelector((state: RootState) => state.highlights);
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const specialsCardsColumns = sortSpecials2(specialsCards);
  const isHighlighted = highlights.includes(id) && draggedHandCard;

  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: y,
        left: x,
        flexDirection: "row",
        // backgroundColor: isHighlighted ? "yellowgreen" : "",
        // boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
        // transition: "background-color 180ms, box-shadow 180ms, left 180ms",
        width: specialsCardsColumns.length * cardWidth,
        height: cardHeight,

      }}
    >
      {specialsCardsColumns.map(cardColumns => (
        <SpecialsCardsColumn cards={cardColumns} dimensions={dimensions} key={cardColumns[0].id} specialsZoneId={id} />
      ))}
      <div
      // { if specialsCardsColumns.length < 4}
      // <SpecialsOfAllTypesDroppable
      /// index={specialsCards.length}
      //  >
      ></div>
    </div>
  );
};
