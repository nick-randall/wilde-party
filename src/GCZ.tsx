import { useMemo, useState } from "react";
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

  const myGCZCardRow = useMemo(() => getCardGroupObjs(enchantmentsRowCards, GCZCards), [GCZCards, enchantmentsRowCards]);
  const cardRowShape =
    rearrange.placeId === id ? getCardRowShapeOnRearrange(myGCZCardRow, rearrange.sourceIndex) : getCardRowShapeOnDraggedOver(myGCZCardRow);
  const ghostCardGroup = myGCZCardRow.find(e => rearrange.draggableId === e.id);

  const isHighlighted = useSelector((state: RootState) => state.highlights.includes(id))
 


  console.log(isHighlighted)

  const dimensions = getAllDimensions(id);

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={!isHighlighted}>
      {(provided) => (
        <div
          className="pl0GCZ"
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            display: "flex",
            top: 100,
            left: 100,
            position: "absolute",
            height: dimensions.cardHeight * 1.5,
            minWidth: dimensions.cardWidth,
            backgroundColor: isHighlighted ? "yellowgreen" : "",
            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "", 
            transition: "180ms"
          }}
        >
          {myGCZCardRow.map((cardGroup, index) => (
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

// <Droppable droppableId="GCZ" direction="horizontal">
// {(provided) => (
//   <div className="GCZ" {...provided.droppableProps} ref={provided.innerRef} style={{ padding: 6, display: "flex" }}>
//     {myGCZCards.map((card, index) => (
//       <Draggable draggableId={card.image} index={index} key={card.id}>
//         {(provided) => (
//           <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//             <div
//               id={`card-container${card.id}`}
//               style={{ width: index === 2 ? dimensions.cardLeftSpread * 2 : dimensions.cardLeftSpread }}
//             >
//               <div
//                 id={`card-absolute-positioning-container${card.id}`}
//                 style={{
//                   position: "absolute",
//                 }}
//               />
//               <Card id={card.id} image={card.image} index={index} dimensions={dimensions} />
//             </div>
//           </div>
//         )}
//       </Draggable>
//     ))}
//     {provided.placeholder}

//     {ghostCardGroup ? (
//       <div style={{ position: "absolute" }}>
//         <GhostCard index={ghostCardGroup.index} image={ghostCardGroup.image} dimensions={dimensions} />
//       </div>
//     ) : null}
//   </div>
// )}
// </Droppable>
