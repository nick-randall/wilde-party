import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DragUpdate, ResponderProvided, DragStart } from "react-beautiful-dnd";
import Card from "./Card";
import { dimensions } from "./dimensions";
import GhostCard from "./GhostCard";
import { myGCZCards } from "./initialCards";


interface ghostCardGroupProps {
  index: number;
  // can this be made into an object so we can have a whole cardGroup as ghostCardGroup?
  image: string;
}

function App() {
  const [currCards, setCurrCards] = useState(myGCZCards);
  const [ghostCardGroup, setGhostCardGroup] = useState<ghostCardGroupProps>();

  const onDragStart = (start: DragStart, provided: ResponderProvided) => setGhostCardGroup({ index: start.source.index, image: start.draggableId });
  const onDragUpdate = (update: DragUpdate) =>
    update.destination ? setGhostCardGroup({ index: update.destination.index, image: update.draggableId }) : setGhostCardGroup(undefined);

  const onDragEnd = () => setGhostCardGroup(undefined);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={onDragStart}>
      <Droppable droppableId="GCZ" direction="horizontal">
        {(provided) => (
          <div className="GCZ" {...provided.droppableProps} ref={provided.innerRef} style={{ padding: 6, display: "flex" }}>
            {myGCZCards.map((card, index) => (
              <Draggable draggableId={card.image} index={index} key={card.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div
                      id={`card-container${card.id}`}
                      style={{ width: index === 2 ? dimensions.cardLeftSpread * 2 : dimensions.cardLeftSpread }}
                    >
                      <div
                        id={`card-absolute-positioning-container${card.id}`}
                        style={{
                          position: "absolute",
                        }}
                      />
                      <Card id={card.id} image={card.image} index={index} dimensions={dimensions} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {ghostCardGroup ? (
              <div style={{ position: "absolute" }}>
                <GhostCard index={ghostCardGroup.index} image={ghostCardGroup.image} dimensions={dimensions} />
              </div>
            ) : null}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
