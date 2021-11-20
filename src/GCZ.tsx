import { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import GhostCardGroup from "./GhostCardGroup";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { RootState } from "./redux/store";

interface GCZProps {
  id: string;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
}

function GCZ(props: GCZProps) {
  const { id, enchantmentsRowCards, GCZCards } = props;
  const myGCZCardRow = useMemo(() => getCardGroupObjs(enchantmentsRowCards, GCZCards), [GCZCards, enchantmentsRowCards]);
  let ghostCardGroupData = useSelector((state: RootState) => state.GCZRearrangingData);
  const draggedHandCard = useSelector((state: RootState)=> state.draggedHandCard)
  const handCardDraggedOver = useSelector((state: RootState) => state.draggedOverData)
  
  if(draggedHandCard && handCardDraggedOver)
    { const cardGroupObj = {id: draggedHandCard.id, size: 1, cards: [draggedHandCard] }
      const index = handCardDraggedOver.index;
      const cardRowShape = getCardRowShapeOnDraggedOver(myGCZCardRow)
      console.log(myGCZCardRow)
      console.log(cardRowShape)
      console.log(index, cardRowShape[index])
     cardRowShape.forEach((e, i) => console.log(e))
      ghostCardGroupData = {ghostCardsObject: cardGroupObj, index: cardRowShape[index], cardRowShape: cardRowShape}}
      
  const dimensions = getAllDimensions(id)

  return (
    <Droppable droppableId={id} direction="horizontal">
      {(provided, snapshot) => ( 
        <div
          className="pl0GCZ"
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={
            snapshot.isDraggingOver
              ? {
                  display: "flex",
                  left:100,
                  top: 100,
                  position: "absolute",
                  height: dimensions.cardHeight * 1.5,
                  minWidth: dimensions.cardWidth,
                  boxShadow: "4px 4px 4px",
                  backgroundColor: "green",
                }
              : {
                  display: "flex",
                  top: 100,
                  left:100,
                  position: "absolute",
                  height: dimensions.cardHeight * 1.5,
                  minWidth: dimensions.cardWidth,
                  boxShadow: "4px 4px 4px",
                }
          }
        >
          {myGCZCardRow.map((cardGroup, index) => (
            <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} />
          ))}
          {provided.placeholder}

          {ghostCardGroupData ? (
            <GhostCardGroup ghostCardGroup={ghostCardGroupData.ghostCardsObject} index={ghostCardGroupData.index} dimensions={dimensions} />
          ) : null}
         
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
