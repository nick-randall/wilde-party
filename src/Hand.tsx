import { useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getDimensions";
interface HandProps {
  id: string;
  handCards: GameCard[]
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


const transitionData: TransitionData[] = [];

const Hand = (props: HandProps) => {
  const { id, handCards } = props;
  const [spread, setSpread] = useState<number>(35);
  const dimensions = getAllDimensions(id);

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled>
      {(provided) => (
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
          }}
          ref={provided.innerRef}
        >
          {handCards.map((card, index) => (
            <div
              // This is the container div for a card and its spacer
              style={{ height: dimensions.cardHeight, display: "flex", position: "relative" }}
            >
              <div
                // This is a card spacer div, responsible for growing and pushing the hand cards out.
                style={{ width: spread, transition: "all 180ms", height: dimensions.cardHeight}}
              />
              <HandCard
                id={card.id}
                index={index}
                image={card.image}
                spread={35}
                dimensions={dimensions}
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
