import { Draggable } from "react-beautiful-dnd";
import Card from "./Card";

export interface CardGroupProps {
  cardGroup: CardGroupObj;
  index: number;
  dimensions: CardDimensions;
}

interface CardOffset {
  left: number,
  top: number
}

const CardGroup = (props: CardGroupProps) => {
  const { cardGroup, index, dimensions } = props;
  const { cardHeight, cardLeftSpread } = dimensions;

  const getOffset = (card: GameCard, cardGroupIndex: number) : CardOffset  => {
    if (card.cardType === "bff") return {top: cardHeight / 2, left: cardLeftSpread / 2};
    if (card.cardType === "zwilling") return {top: cardHeight /2, left: 0}
    if (cardGroupIndex > 0) return {top: 0, left: cardLeftSpread}
    else return {top: 0, left: 0}
  };

  return (
    <Draggable draggableId={cardGroup.id} index={index} key={cardGroup.id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            id={`cardgroup-relative-positioning-container${cardGroup.id}`}
            style={{
              width: cardGroup.size === 2 ? cardLeftSpread * 2 : cardLeftSpread,
              // this here determines height of GCZ dragover area
              height: cardHeight * 1.5,
            }}
          >
            <div
              id={`cardgroup-absolute-positioning-container${cardGroup.id}`}
              style={{
                position: "absolute",
              }}
            />
            <div id={`cardgroup-relative-positioning-container`} style={{ position: "relative" }}>
              {cardGroup.cards.map((card, cardGroupIndex) => (
                <Card
                  offsetTop={getOffset(card, cardGroupIndex).top}//getDimensions COULD take care of this, but maybe not the best use of it...
                  offsetLeft={getOffset(card, cardGroupIndex).left}
                  cardGroupIndex={cardGroupIndex}
                  id={cardGroup.id}
                  image={card.image}
                  index={index}
                  dimensions={dimensions}
                  key={card.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default CardGroup;
