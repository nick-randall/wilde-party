import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import GhostCard from "./GhostCard";
import { getDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";

interface UWZProps {
  id: string;
  unwantedCards: GameCard[];
  playerZoneSize: {width: number, height: number}
}

export const UWZ = (props: UWZProps) => {
  const { id, unwantedCards, playerZoneSize } = props;

  const draggedOver = useSelector((state: RootState) => state.dragUpdate);
  const rearrange = useSelector((state: RootState) => state.rearrangingData);

  const ghostCardIndex = draggedOver.droppableId === id ? draggedOver.index : rearrange.sourceIndex;
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const highlights = useSelector((state: RootState) => state.highlights);

  const isHighlighted = highlights.includes(id);

  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);

  const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  const dimensions = getDimensions(0, "UWZ");
  const { cardWidth, cardHeight, cardTopSpread } = dimensions;
  const { x, y } = getPlacesLayout(id, playerZoneSize);
  return (
    <div style={{ position: "absolute", left: x, top: y, transition:"left 180ms" }}>
      {unwantedCards.map((card, index) => (
        <Card id={card.id} image={card.image} index={index} dimensions={dimensions} offsetTop={ index * dimensions.cardTopSpread} key={card.id} placeId={id}/>
      ))}
      <Droppable droppableId={id} isDropDisabled={!allowDropping}>
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
            {ghostCard ? <GhostCard //index={ghostCardIndex} 
            image={ghostCard.image} dimensions={dimensions} zIndex={9} /> : null}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default UWZ;
