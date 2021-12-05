import { getLayout } from "./dimensions/getLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getSpecialsOfType, sortSpecials2 } from "./helperFunctions/getSpecialsOfType";
import { SpecialsCardsColumn } from "./SpecialsCardsColumn";

interface SpecialsZoneProps {
  specialsCards: GameCard[];
  id: string;
}

export const SpecialsZone = (props: SpecialsZoneProps) => {
  const { specialsCards, id } = props;
  const dimensions = getAllDimensions(id);
  const { x, y } = getLayout(id);
  const specialsCardsColumns = sortSpecials2(specialsCards);

  return (
    <div style={{ display: "flex", position: "absolute", top: y, left: x, flexDirection: "row" }}>
      {specialsCardsColumns.map(column => (
        <SpecialsCardsColumn cards={column} dimensions={dimensions} key={column[0].id} specialsZoneId={id} />
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
