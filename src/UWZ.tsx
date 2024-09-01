import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import GhostCard from "./GhostCard";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";

interface UWZProps {
  id: number;
  unwantedCards: GameCard[];
  alignment: string;
}

export const UWZ = (props: UWZProps) => {
  const { id, unwantedCards, alignment } = props;
  const droppableData: DroppableData = { type: "place", id };
  const droppableId = JSON.stringify(droppableData);

  const {draggedHandCard, draggedOver, highlights, rearrangingData} = useSelector((state: RootState) => state);

  const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
  const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const isHighlighted = highlights.includes(id);

  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);

  const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  const dimensions = getAllDimensions(id);
  const { cardWidth, cardHeight, cardTopSpread } = dimensions;
  return (
    <div style={{ transition:"left 180ms" }} className={`grid-item ${alignment}`}>
      {unwantedCards.map((card, index) => (
        <Card id={card.id} imageName={card.imageName} index={index} dimensions={dimensions} offsetTop={ index * dimensions.cardTopSpread} key={card.id} />
      ))}
      <Droppable droppableId={droppableId} isDropDisabled={!allowDropping}>
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              position: "relative",
              top: (unwantedCards.length) * cardTopSpread,
              height: cardHeight,
              minWidth: cardWidth,
              backgroundColor: isHighlighted ? "yellowgreen" : "",
              boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
              transition: "background-color 180ms, box-shadow 180ms, left 180ms",
            }}
          >
            {provided.placeholder}
            {ghostCard ? <GhostCard index={ghostCardIndex} imageName={ghostCard.imageName} dimensions={dimensions} zIndex={9} /> : null}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default UWZ;
