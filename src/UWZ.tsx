import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./gameComponents/Card";
import GhostCard from "./gameComponents/GhostCard";
import { getDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";

interface UWZProps {
  id: string;
  unwantedCards: GameCard[];
}

export const UWZ = (props: UWZProps) => {
  const { id, unwantedCards } = props;

  // const draggedOver = useSelector((state: RootState) => state.dragUpdate);
  // const rearrange = useSelector((state: RootState) => state.rearrangingData);

  // const ghostCardIndex = draggedOver.droppableId === id ? draggedOver.index : rearrange.sourceIndex;
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  // const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const highlights = useSelector((state: RootState) => state.highlights);

  const isHighlighted = highlights.includes(id);

  // const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);

  // const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  const dimensions = getDimensions(0, "UWZ");
  const devSettings = useSelector((state: RootState) => state.devSettings);

  const { cardWidth, cardHeight, cardTopSpread } = dimensions;
  return (
    <div className={devSettings.grid.on ? "place-grid" : ""} style={{ transition: "left 180ms" }}>
      {unwantedCards.map((card, index) => (
        <Card
          id={card.id}
          image={card.image}
          index={index}
          dimensions={dimensions}
          offsetTop={index * dimensions.cardTopSpread}
          key={card.id}
          placeId={id}
          placeType="UWZ"
        />
      ))}
      <Droppable droppableId={id} isDropDisabled={true}>
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              position: "relative",
              top: unwantedCards.length * cardTopSpread,
              height: cardHeight,
              minWidth: cardWidth,
              backgroundColor: isHighlighted ? "yellowgreen" : "",
              boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
              transition: "background-color 180ms, box-shadow 180ms, left 180ms",
            }}
          >
            {provided.placeholder}
            {/* {ghostCard ? (
              <GhostCard //index={ghostCardIndex}
                image={ghostCard.image}
                dimensions={dimensions}
                zIndex={9}
              />
            ) : null} */}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default UWZ;
