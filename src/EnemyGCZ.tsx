import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";

interface EnemyGCZProps {
  id: string;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

const EnemyGCZ = (props: EnemyGCZProps) => {
  const { GCZCards, id, playerZoneSize } = props;
  const {x, y} = getPlacesLayout(id, playerZoneSize)
  const dimensions = getAllDimensions(id);
  return (
    <div style={{left:x, top: y, position:"absolute" }}>
      {GCZCards.map((card, index) => (
        <Card dimensions={dimensions} key={card.id} id={card.id} index={index} image={card.image} offsetLeft={index * dimensions.cardWidth} />
      ))}
    </div>
  );
};

export default EnemyGCZ;
