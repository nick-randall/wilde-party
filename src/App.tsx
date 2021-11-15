import { useMemo, useState } from "react";
import { DragDropContext, Droppable, DragUpdate, DragStart } from "react-beautiful-dnd";
import CardGroup from "./CardGroup";
import { dimensions } from "./dimensions";
import GhostCardGroup from "./GhostCardGroup";
import { getCardGroupObjs, getCardRowShapeOnRearrange, } from "./groupGCZCards";
import { myEnchantmentsRowCards, myGCZCards } from "./initialCards";

interface GhostCardGroupData {
  index: number;
  ghostCardGroup: CardGroupObj;
}

function App() {
  const myGCZCardRow = useMemo(() => getCardGroupObjs(myEnchantmentsRowCards, myGCZCards), []);
  const [ghostCardGroup, setGhostCardGroup] = useState<GhostCardGroupData>();
  // an array containing the offset from left of each cardGroup eg. [0,1,2,4,5,7]
  const [cardRowShape, setCardRowShape] = useState<number[]>([]);

  const onDragStart = (start: DragStart) => {
    const startIndex = start.source.index;
    const cardRowShape = getCardRowShapeOnRearrange(myGCZCardRow, startIndex);
    setCardRowShape(cardRowShape);

    setGhostCardGroup({
      index: cardRowShape[startIndex],
      ghostCardGroup: myGCZCardRow.filter((cardGroup) => cardGroup.id === start.draggableId)[0],
    });
  };

  const onDragUpdate = (update: DragUpdate) =>
    update.destination
      ? setGhostCardGroup({
          index: cardRowShape[update.destination.index],
          ghostCardGroup: myGCZCardRow.filter((cardGroup) => cardGroup.id === update.draggableId)[0],
        })
      : setGhostCardGroup(undefined);

  const onDragEnd = () => setGhostCardGroup(undefined);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={onDragStart}>
      <Droppable droppableId="GCZ" direction="horizontal">
        {(provided) => (
          <div
            className="GCZ"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ padding: 6, display: "flex", top: 100, position: "absolute" }}
          >
            {myGCZCardRow.map((cardGroup, index) => (
              <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} />
            ))}
            {provided.placeholder}

            {ghostCardGroup ? (
              <GhostCardGroup ghostCardGroup={ghostCardGroup.ghostCardGroup} index={ghostCardGroup.index} dimensions={dimensions} />
            ) : null}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;

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
