import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { RootState } from "./redux/store";

interface GCZProps {
  id: number;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
}

function GCZ(props: GCZProps) {
  const { id, enchantmentsRowCards, GCZCards } = props;

  const {draggedOver, rearrangingData, draggedHandCard, highlights} = useSelector((state: RootState) => state.dragEventState);
  const droppableId = JSON.stringify({ type: "place", id });

  const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
  const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const cardRow: CardGroupObj[] = getCardGroupObjs(enchantmentsRowCards, GCZCards);
  const cardRowShape = rearrangingData.placeId === id ? getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex) : getCardRowShapeOnDraggedOver(cardRow);
  
  const ghostCardGroup = cardRow.find(e => rearrangingData.draggedId === e.id);
  console.log("ghostCardGroup", ghostCardGroup);
  const isHighlighted = highlights.includes(id);

  const rearranging = useSelector((state: RootState) => state.dragEventState.rearrangingData.placeId === id);

  // const containsTargetedCard =
  //   highlights.some(h => enchantmentsRowCards.map(e => e.id).includes(h)) || highlights.some(h => GCZCards.map(e => e.id).includes(h));

  const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  const dimensions = getAllDimensions(id);
  const { cardHeight } = dimensions;
  return (
    <Droppable droppableId={droppableId} direction="horizontal" isDropDisabled={!allowDropping}>
      {provided => (
        <div
        className="pl0GCZ"
        
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            display: "flex",
            // top: 100,
            // position: "absolute",
            margin: 0,
            border: "1px solid black",
            //left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
            height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
            minWidth: dimensions.cardWidth,
            backgroundColor: isHighlighted ? "yellowgreen" : "",
            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
            transition: "background-color 180ms, box-shadow 180ms, left 180ms",
          }}
        >
          {cardRow.map((cardGroup, index) => (
            <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} />
          ))}
          {provided.placeholder}

          {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cardRowShape[ghostCardIndex]} dimensions={dimensions} /> : null}
          {ghostCard ? <GhostCard index={cardRowShape[ghostCardIndex]} imageName={ghostCard.imageName} dimensions={dimensions} zIndex={0} /> : null}
        </div>
      )}
    </Droppable>
  );
}

export default GCZ;
