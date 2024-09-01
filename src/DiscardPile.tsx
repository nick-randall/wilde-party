import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";

interface DiscardPileProps {
  cards: GameCard[];
  id: number;
}

const DiscardPile = (props: DiscardPileProps) => {
  const { id, cards } = props;
  const dimensions = getAllDimensions(id);
  return (
    <div>
      {cards.map((card, index) => (
        // <img src={card.image} alt={card.image} style={{ height: cardHeight, width: cardWidth }} />
        <Card id={card.id} key={card.id} index={0} image={card.image} dimensions={dimensions} offsetLeft={index* 3}/>
      ))}
    </div>
  );
};

export default DiscardPile;
