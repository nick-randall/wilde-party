import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";

interface DiscardPileProps {
  cards: GameCard[];
  id: string;
  zoneSize: {width: number, height: number}
}

const DiscardPile = (props: DiscardPileProps) => {
  const { id, cards, zoneSize } = props;
  const dimensions = getAllDimensions(id);
  const {x,y} = getPlacesLayout(id, zoneSize)
  return (
    <div style={{position: "absolute", left: x, top: y}}>
      {cards.map(card => (
        // <img src={card.image} alt={card.image} style={{ height: cardHeight, width: cardWidth }} />
        <Card id={card.id} index={0} image={card.image} dimensions={dimensions} />
      ))}
    </div>
  );
};

export default DiscardPile;
