import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import CardEmissary from "./TableCardEmissary";
import EmissaryHandler from "./transitionFunctions.ts/EmissaryHandler";

interface DiscardPileProps {
  id: string;
  zoneSize: { width: number; height: number };
}

const DiscardPile: React.FC<DiscardPileProps> = ({ id, zoneSize }) => {
  const dimensions = getAllDimensions(id);
  const { x, y } = getPlacesLayout(id, zoneSize);
  return (
    <EmissaryHandler player={null} placeType={"discardPile"} placeId={id}>
      {(cards, emissaryCardIndex) => (
        <div style={{ position: "absolute", left: x, top: y }}>
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
