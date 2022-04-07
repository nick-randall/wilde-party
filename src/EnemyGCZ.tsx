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
  const { GCZCards, enchantmentsRowCards, id, playerZoneSize } = props;
  const { x, y } = getPlacesLayout(id, playerZoneSize);
  const dimensions = getAllDimensions(id);
  return (
    <div style={{ left: x, top: y, position: "absolute" }}>
      {GCZCards.map((card, index) => 
      <div style={{left: index * dimensions.cardLeftSpread, position:"absolute"}} key={card.id}>
        <Card dimensions={dimensions} id={card.id} index={index} image={card.image}  placeId={id}/>
      )
      </div >)}
      <div style={{ top: dimensions.cardHeight/2, position: "absolute" }}>
      {enchantmentsRowCards.map((card) => (
        <div style={{left: card.index * dimensions.cardLeftSpread, position:"absolute"}} key={card.id}>
        <Card dimensions={dimensions}  id={card.id} index={card.index} image={card.image} placeId={id} />
        </div >))}
      </div>
    </div>
  );
};

export default EnemyGCZ;
