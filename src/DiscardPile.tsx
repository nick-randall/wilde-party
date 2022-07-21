import Card from "./Card";
import { getDimensions } from "./helperFunctions/getDimensions";
import CardEmissary from "./TableCardEmissary";
import EmissaryHandler from "./transitionFunctions/EmissaryHandler";

interface DiscardPileProps {
  id: string;
}

const DiscardPile: React.FC<DiscardPileProps> = ({ id }) => {
  const dimensions = getDimensions(null, "discardPile")
  return (
    <EmissaryHandler player={null} placeType={"discardPile"} placeId={id}>
      {(cards, emissaryCardIndex) => (
        <div style={{  }}>
          {cards.map((card, index) =>
            emissaryCardIndex === index ? (
              <CardEmissary id={card.id} image={card.image} index={index} dimensions={dimensions} offsetLeft={index * 3} />
            ) : (
              // <img src={card.image} alt={card.image} style={{ height: cardHeight, width: cardWidth }} />
              <Card id={card.id} key={card.id} index={0} image={card.image} dimensions={dimensions} offsetLeft={index * 3} placeId={id} />
            )
          )}
        </div>
      )}
    </EmissaryHandler>
  );
};

export default DiscardPile;
