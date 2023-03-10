import TableCardMockRender from "../mockRender/TableCardMockRender";
import { UiGameCard } from "../types/uiTypes";
import Card from "./Card";
import CardElement from "./CardElement";

export interface CardGroupProps {
  cardGroup: NewCardGroupObj;
  index: number;
  dimensions: AllDimensions;
  GCZId: string;
}

interface CardOffset {
  left: number;
  top: number;
}

const CardGroup = (props: CardGroupProps) => {
  const { cardGroup, dimensions } = props;
  const { cardHeight, cardLeftSpread } = dimensions;

  const getOffset = (card: UiGameCard, cardGroupIndex: number): CardOffset => {
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
        position: "relative",
      }}
    >
      {cardGroup.cards.map((card, cardGroupIndex) => (
        <CardElement
          offsetTop={getOffset(card, cardGroupIndex).top}
          offsetLeft={getOffset(card, cardGroupIndex).left}
          //cardGroupIndex={cardGroupIndex}
          card={card}
          cardType="tableCard"
          dimensions={dimensions}
          key={card.id}
          placeType="GCZ"
        />
      ))}
    </div>
  );
};
export default CardGroup;
