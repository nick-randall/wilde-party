import Card from "./Card";
import { getAllDimensions } from "../helperFunctions/getDimensions";

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
        // <img src={card.imageName} alt={card.imageName} style={{ height: cardHeight, width: cardWidth }} />
        <Card id={card.id} key={card.id} index={0} imageName={card.imageName} dimensions={dimensions} offsetLeft={index* 3}/>
      ))}
    </div>
  );
};

export default DiscardPile;
