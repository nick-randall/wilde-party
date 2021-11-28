import { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { RootState } from "./redux/store";

interface GCZProps {
  id: string;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  rearrange: SimpleRearrangingData;
  draggedOver: UpdateDragData | undefined;
}

function GCZ(props: GCZProps) {
  const { id, enchantmentsRowCards, GCZCards, rearrange, draggedOver } = props;

  const index = draggedOver ? draggedOver.index : rearrange.sourceIndex;

  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;

  const cardRow = useMemo(() => getCardGroupObjs(enchantmentsRowCards, GCZCards), [GCZCards, enchantmentsRowCards]);
  const cardRowShape =
    rearrange.placeId === id ? getCardRowShapeOnRearrange(cardRow, rearrange.sourceIndex) : getCardRowShapeOnDraggedOver(cardRow);
  const ghostCardGroup = cardRow.find(e => rearrange.draggableId === e.id);

  const isHighlighted = useSelector((state: RootState) => state.highlights.includes(id))

  const rearranging = useSelector((state: RootState) => state.rearrangingPlaceId === id)

  const allowDropping = isHighlighted || rearranging;

  const dimensions = getAllDimensions(id);

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={!allowDropping} isCombineEnabled={true}>
      {(provided, s) => (
        <div
          className="pl0GCZ"
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            display: "flex",
            top: 100,
            //left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
            left: 100,
            position: "absolute",
            height: dimensions.cardHeight * 1.5,
            minWidth: dimensions.cardWidth,
            backgroundColor: isHighlighted ? "yellowgreen" : "",
            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "", 
            transition: "background-color 180ms, box-shadow 180ms"
          }}
        >
          {cardRow.map((cardGroup, index) => (
            <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} />
          ))}
          {provided.placeholder}

          {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cardRowShape[index]} dimensions={dimensions} /> : null}
          {ghostCard ? <GhostCard index={cardRowShape[index]} image={ghostCard.image} dimensions={dimensions} /> : null}
        </div>
      )}
    </Droppable>
  );
}

export default GCZ;
