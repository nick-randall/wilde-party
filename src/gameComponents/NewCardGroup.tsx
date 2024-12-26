import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCardGroupStyles } from "../helperFunctions/getCardStyles";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";

export interface NewCardGroupProps {
  cardGroup: NewCardGroupObj;
  cardGroupIndex: number;
  physicalIndex: number; // how many cards from the left
  enchantableNeighbours: EnchantableNeighbour[];
}

interface CardOffset {
  left: number;
  top: number;
}

const NewCardGroup: React.FC<NewCardGroupProps> = ({ cardGroup, cardGroupIndex, physicalIndex, enchantableNeighbours }) => {
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const { left, cardWidth, cardHeight } = getCardGroupStyles(cardGroup, physicalIndex, currSnapshot);
  const draggableData: DraggableData = {
    id: cardGroup.id,
    type: "cardGroup",
    numCards: cardGroup.cards.length,
  };
  const draggableId = JSON.stringify(draggableData);

  const droppableData: DroppableData = {
    type: "cardGroup",
    id: cardGroup.id,
    calculatedIndex: cardGroup.index,
    enchantableNeighbours: enchantableNeighbours,
  };

  const droppableId = JSON.stringify(droppableData);

  const getOffset = (card: GameCard, cardIndexWithinGroup: number): CardOffset => {
    console.log("cardtype");
    console.log(card.cardType);

    // TODO check this
    if (card.cardType === "bff") return { top: cardHeight / 2, left: left + cardWidth / 2 };
    if (card.cardType === "zwilling") return { top: cardHeight / 2, left: 0 };
    if (cardIndexWithinGroup > 0) return { top: 0, left: left + cardWidth };
    else return { top: 0, left: 0 };
  };

  return (
    <Draggable draggableId={draggableId} index={cardGroupIndex} key={cardGroup.id}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Droppable droppableId={droppableId}>
            {d => (
              <div
                // Container only the size of left ie. able to be smaller
                // than the size of the cardGroups and allows overlapping cardGroups.
                // It represents the matrix of draggable elements
                style={{
                  position: "absolute",
                  left: left,
                  width: cardGroup.size * cardWidth,
                  // this here determines height of GCZ dragover area
                  height: cardHeight * 1.5,
                }}
              >
                <div
                  // This relative container allows the cards to be positioned absolutely within the CardGroup
                  style={{ position: "relative" }}
                  {...d.droppableProps}
                  ref={d.innerRef}
                >
                  {cardGroup.cards.map((card, cardIndexWithinGroup) => (
                    <img
                      style={{
                        height: cardHeight,
                        width: cardWidth,
                        top: getOffset(card, cardIndexWithinGroup).top,
                        left: getOffset(card, cardIndexWithinGroup).left,
                      }}
                      id={card.id.toString()}
                      draggable="false"
                      src={`./images/${card.imageName}.jpg`}
                      key={card.id}
                      alt={card.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
export default NewCardGroup;
