import { Draggable } from "react-beautiful-dnd";
import Card from "./Card";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCardStyles, getCardStyleValues } from "../helperFunctions/getCardStyles";

export interface CardGroupProps {
  cardGroup: CardGroupObj;
  index: number;
}

interface CardOffset {
  left: number;
  top: number;
}

const CardGroup: React.FC<CardGroupProps> = ({cardGroup, index}) => {
  const {currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState)
  const { left, cardHeight  } = getCardStyleValues(cardGroup.id, currSnapshot);
  const draggableData: DraggableData = {
    id: cardGroup.id,
    type: "cardGroup",
    numCards: cardGroup.cards.length,
  };
  const draggableId = JSON.stringify(draggableData);

  const getOffset = (card: GameCard, cardGroupIndex: number): CardOffset => {
    if (card.cardType === "bff") return { top: cardHeight / 2, left: left / 2 };
    if (card.cardType === "zwilling") return { top: cardHeight / 2, left: 0 };
    if (cardGroupIndex > 0) return { top: 0, left: left };
    else return { top: 0, left: 0 };
  };

  return (
    <Draggable draggableId={draggableId} index={index} key={cardGroup.id}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            // Container only the size of left ie. able to be smaller
            // than the size of the cardGroups and allows overlapping cardGroups.
            // It represents the matrix of draggable elements
            style={{
              // transition: "300ms",
              width: cardGroup.size === 2 ? left * 2 : left,
              // this here determines height of GCZ dragover area
              height: cardHeight * 1.5,
            }}
          >
            <div
              // This relative container allows the cards to be positioned absolutely within the CardGroup
              style={{ position: "relative" }}
            >
              {cardGroup.cards.map((card, cardGroupIndex) => (
                <Card
                  offsetTop={getOffset(card, cardGroupIndex).top}
                  offsetLeft={getOffset(card, cardGroupIndex).left}
                  //cardGroupIndex={cardGroupIndex}
                  id={card.id}
                  imageName={card.imageName}
                  index={index}
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
