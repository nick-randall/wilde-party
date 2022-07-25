import TableCardMockRender from "../mockRender/TableCardMockRender";
import Card from "./Card";

export interface CardGroupProps {
  cardGroup: NewCardGroupObj;
  index: number;
  dimensions: AllDimensions;
  mockRenderIds: string[];
  GCZId: string;
}

interface CardOffset {
  left: number;
  top: number;
}

const CardGroup = (props: CardGroupProps) => {
  const { cardGroup, index, dimensions, GCZId, mockRenderIds } = props;
  const { cardHeight, cardLeftSpread } = dimensions;

  const getOffset = (card: GameCard, cardGroupIndex: number): CardOffset => {
    if (card.cardType === "bff") return { top: cardHeight / 2, left: cardLeftSpread / 2 };
    if (card.cardType === "zwilling") return { top: cardHeight / 2, left: 0 };
    if (cardGroupIndex > 0) return { top: 0, left: cardLeftSpread };
    else return { top: 0, left: 0 };
  };

  return (
    <div
      // Container only the size of cardLeftSpread ie. able to be smaller
      // than the size of the cardGroups and allows overlapping cardGroups.
      // It represents the matrix of draggable elements
      style={{
        transition: "300ms",
        // width: cardGroup.size === 2 ? cardLeftSpread * 2 : cardLeftSpread,
        width: cardGroup.width * cardLeftSpread,
        // this here determines height of GCZ dragover area
        height: cardHeight * 1.5,
        // border: "thin black solid",
      }}
    >
      {cardGroup.cards.map((card, cardGroupIndex) =>
        mockRenderIds.includes(card.id) ? (
          <TableCardMockRender cardId={card.id} index={index} dimensions={dimensions} key={card.id +"MockRender"}/>
        ) : (
          <Card
            offsetTop={getOffset(card, cardGroupIndex).top}
            offsetLeft={getOffset(card, cardGroupIndex).left}
            //cardGroupIndex={cardGroupIndex}
            id={card.id}
            image={card.image}
            index={index}
            dimensions={dimensions}
            key={card.id}
            placeId={GCZId}
          />
        )
      )}
    </div>
  );
};
export default CardGroup;
