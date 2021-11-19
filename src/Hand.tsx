import { useRef, useState } from "react";
import { handDimensions } from "./handDimensions";
import HandCard from "./HandCard";
import { myHandCards } from "./initialCards";
import { DragDropContext, Draggable, DragStart, Droppable } from "react-beautiful-dnd";
import CardGroup from "./CardGroup";
interface HandProps {
  id: string;
  // //children: React.ReactNode;
  // cards: GameCard[];
  // numCards: number;

  // // only for passing down to cards!
  // gameSnapshot: GameSnapshot;
  // legalTargets: LegalTarget[];
  // dimensions: PlaceDimensions;
  // transitionData: TransitionData[];
  // removeCardTransition: (returnedCardId: string) => void;
}

const handCards = myHandCards;
const dimensions = handDimensions;
const transitionData: TransitionData[] = [];

const Hand = (props: HandProps) => {
  //const { numCards, dimensions, cards, gameSnapshot, legalTargets, removeCardTransition, transitionData } = props;
  const { id } = props;
  const [spread, setSpread] = useState<number>(35);
  const [mouseEnteredHand, setMouseEnteredHand] = useState(false);

  const dontSpread = (isDraggingOver: boolean) => !isDraggingOver && !mouseEnteredHand;

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={true}>
      {(provided, snapshot) => (
        <div
          id={props.id}
          onMouseEnter={() => setSpread(120)}
          onMouseLeave={() => setSpread(35)}
          style={{
            position: "absolute",
            display: "flex",
            bottom: 200,
            left: 700 - (spread / 2) * handCards.length,
            width: handCards.length * dimensions.cardWidth,
            transition: "180ms",
            height: dimensions.cardHeight,
            //pointerEvents: legalTargetStatus === "notAmongLegalTargets" || rearranging ? "none" : "auto",
          }}
          ref={provided.innerRef}
        >
          {handCards.map((card, index) => (
            <div
              // container div for a card and its spacer
              style={{ height: dimensions.cardHeight, display: "flex", position: "relative",border: "thick red dotted"  }}
            >
              <div
                // card spacers
                style={{ width: spread, transition: "all 180ms", height: dimensions.cardHeight, border: "thin black solid" }}
              />
              <HandCard
                id={card.id}
                index={index}
                image={card.image}
                spread={dontSpread(snapshot.isDraggingOver) ? 35: 125}
                //spread={35}
                dimensions={handDimensions}
                transitionData={transitionData.find(trans => trans.card.id === card.id)}
                numHandCards={handCards.length}
                key={card.id}
              />
            </div>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Hand;
