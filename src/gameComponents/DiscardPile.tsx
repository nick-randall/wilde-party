import { getDimensions } from "../helperFunctions/getDimensions";
import MockRenderProvider from "../mockRender/MockRenderProvider";
import TableCardMockRender from "../mockRender/TableCardMockRender";
import Card from "./Card";

interface DiscardPileProps {
  id: string;
}

const DiscardPile: React.FC<DiscardPileProps> = ({ id }) => {
  const dimensions = getDimensions(null, "discardPile")
  return (
    <MockRenderProvider player={null} placeType={"discardPile"} placeId={id}>
      {(cards, mockRenderIds) => (
        <div style={{  }}>
          {cards.map((card, index) =>
            mockRenderIds.includes(card.id) ? (
              <TableCardMockRender cardId={card.id} index={index} dimensions={dimensions} offsetLeft={index * 3} />
            ) : (
              // <img src={card.image} alt={card.image} style={{ height: cardHeight, width: cardWidth }} />
              <Card id={card.id} key={card.id} index={0} image={card.image} dimensions={dimensions} offsetLeft={index * 3} placeId={id} placeType="discardPile"/>
            )
          )}
        </div>
      )}
    </MockRenderProvider>
  );
};

export default DiscardPile;
