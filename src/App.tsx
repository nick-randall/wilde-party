import React, { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, DragUpdate, ResponderProvided, DragStart } from "react-beautiful-dnd";
import Card from "./Card";
import CardGroup from "./CardGroup";
import { dimensions } from "./dimensions";
import GhostCard from "./GhostCard";
import { getCardGroupObjs, getCardGroupsShape, getCardGroupsShape2 } from "./groupGCZCards";
import { myEnchantmentsRowCards, myGCZCards } from "./initialCards";

interface GhostCardGroupProps {
  index: number;
  cardGroupObj: CardGroupObj;
}

function App() {
  const [ghostCardGroup, setGhostCardGroup] = useState<GhostCardGroupProps>();
  const myGCZCardRow = useMemo(() => getCardGroupObjs(myEnchantmentsRowCards, myGCZCards), []);
  const myGCZCardRowShape = useMemo(() => getCardGroupsShape2(myGCZCardRow), [myGCZCardRow]);

  const onDragStart = (start: DragStart) =>
    setGhostCardGroup({
      index: myGCZCardRowShape[start.source.index],
      cardGroupObj: myGCZCardRow.filter((cardGroup) => cardGroup.id === start.draggableId)[0],
    });

  const onDragUpdate = (update: DragUpdate) =>
    update.destination
      ? setGhostCardGroup({
          index: myGCZCardRowShape[update.destination.index],
          cardGroupObj: myGCZCardRow.filter((cardGroup) => cardGroup.id === update.draggableId)[0],
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
              <div id={`ghostcard-absolute-positioning-container${ghostCardGroup}`} style={{ position: "absolute", zIndex: 0 }}>
                {ghostCardGroup.cardGroupObj.cards.map((ghostCard) => (
                  <GhostCard index={ghostCardGroup.index} image={ghostCard.image} dimensions={dimensions} key={ghostCard.id} />
                ))}
              </div>
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
