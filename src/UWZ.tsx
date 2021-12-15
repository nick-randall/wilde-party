import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import { getLayout } from "./dimensions/getLayout";
import GhostCard from "./GhostCard";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";

interface UWZProps {
  id: string;
  unwantedCards: GameCard[];
}

export const UWZ = (props: UWZProps) => {

  const { id, unwantedCards } = props;

  const draggedOver = useSelector((state: RootState) => state.dragUpdate);
  const rearrange = useSelector((state: RootState) => state.rearrangingData);

  const ghostCardIndex = draggedOver.droppableId === id ? draggedOver.index : rearrange.sourceIndex;
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const highlights = useSelector((state: RootState) => state.highlights);

  const isHighlighted = highlights.includes(id);

  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);

  const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  const dimensions = getAllDimensions(id);
  const { cardWidth } = dimensions;
  const { x, y } = getLayout(id);

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={!allowDropping}>
      {provided => (
        <div
          className="pl0GCZ"
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            display: "flex",
            //top: 100,
            position: "absolute",
            margin: 0,
            //left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
            left: x,
            top: y,
            minWidth: cardWidth,
            backgroundColor: isHighlighted ? "yellowgreen" : "",
            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
            transition: "background-color 180ms, box-shadow 180ms, left 180ms",
          }}
        >
          {unwantedCards.map((card, index) => (
            <Card id={card.id} image={card.image} index={index} dimensions={dimensions} offsetTop={index * dimensions.cardTopSpread} key={card.id} />
          ))}
          {provided.placeholder}

         
          {ghostCard ? <GhostCard index={ghostCardIndex} image={ghostCard.image} dimensions={dimensions} zIndex={0} /> : null}
        </div>
      )}
    </Droppable>
  );
}

export default UWZ;


