import { useMemo, useState } from "react";
import { DragDropContext, Droppable, DragUpdate, DragStart } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import { dimensions } from "./dimensions";
import GhostCardGroup from "./GhostCardGroup";
import { getCardGroupObjs, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { myEnchantmentsRowCards, myGCZCards } from "./initialCards";
import { RootState } from "./redux/store";

interface GhostCardGroupData {
  index: number;
  ghostCardObjects: CardGroupObj;
}

function GCZ() {
  const myGCZCardRow = useMemo(() => getCardGroupObjs(myEnchantmentsRowCards, myGCZCards), []);
  const [ghostCardGroupData, setGhostCardGroupData] = useState<GhostCardGroupData>();
  // an array containing the offset from left of each cardGroup eg. [0, 1, 2, 4, 5, 7]
  const [cardRowShape, setCardRowShape] = useState<number[]>([]);

  const rearrangingData = useSelector((state: RootState) => state.GCZRearrangingData);

  console.log(rearrangingData);

  const onDragStart = (start: DragStart) => {
    const startIndex = start.source.index;
    const cardRowShape = getCardRowShapeOnRearrange(myGCZCardRow, startIndex);
    setCardRowShape(cardRowShape);

    setGhostCardGroupData({
      index: cardRowShape[startIndex],
      ghostCardObjects: myGCZCardRow.filter(cardGroup => cardGroup.id === start.draggableId)[0],
    });
  };

  const onDragUpdate = (update: DragUpdate) =>
    update.destination
      ? setGhostCardGroupData({
          index: cardRowShape[update.destination.index],
          ghostCardObjects: myGCZCardRow.filter(cardGroup => cardGroup.id === update.draggableId)[0],
        })
      : setGhostCardGroupData(undefined);

  const onDragEnd = () => setGhostCardGroupData(undefined);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={onDragStart}>
      <Droppable droppableId="GCZ" direction="horizontal">
        {provided => (
          <div className="GCZ" {...provided.droppableProps} ref={provided.innerRef} style={{ display: "flex", top: 100, position: "absolute" }}>
            {myGCZCardRow.map((cardGroup, index) => (
              <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} />
            ))}
            {provided.placeholder}

            {ghostCardGroupData ? (
              <GhostCardGroup ghostCardGroup={ghostCardGroupData.ghostCardObjects} index={ghostCardGroupData.index} dimensions={dimensions} />
            ) : null}
          </div>
        )}
      </Droppable>
    </DragDropContext>
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
