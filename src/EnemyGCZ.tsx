import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";

interface EnemyGCZProps {
  id: number;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  alignment: string;
}

const EnemyGCZ = (props: EnemyGCZProps) => {
  const { GCZCards, enchantmentsRowCards, id, alignment } = props;
  const dimensions = getAllDimensions(id);
  return (
    <div className={`grid-item ${alignment}`}>
      {GCZCards.map((card, index) => (
        <div key={card.id} style={{ left: index * dimensions.cardLeftSpread, position: "absolute" }}>
          <Card dimensions={dimensions} id={card.id} index={index} imageName={card.imageName} />
        </div>
      ))}
      <div style={{ top: dimensions.cardHeight / 2, position: "absolute" }}>
        {enchantmentsRowCards.map(card => (
          <div key={card.id} style={{ left: card.index * dimensions.cardLeftSpread, position: "absolute" }}>
            <Card dimensions={dimensions} id={card.id} index={card.index} imageName={card.imageName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnemyGCZ;
