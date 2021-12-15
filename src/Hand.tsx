import { useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getLayout } from "./dimensions/getLayout";
interface HandProps {
  id: string;
  handCards: GameCard[];
}

const transitionData: TransitionData[] = [];

const Hand = (props: HandProps) => {
  const { id, handCards } = props;
  const [mouseOverHand, setMouseOverHand] = useState(false);
  const dimensions = getAllDimensions(id);
  const maxCardLeftSpread = dimensions.maxCardLeftSpread || 0;
  const handCardDragged = useSelector((state: RootState) => state.draggedHandCard);
  const spread = !handCardDragged && mouseOverHand ? maxCardLeftSpread : dimensions.cardLeftSpread;

  const { x, y } = getLayout(id);

  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={true}>
      {provided => (
        <div
          id={props.id}
          onMouseEnter={() => setMouseOverHand(true)}
          onMouseLeave={() => setMouseOverHand(false)}
          style={{
            position: "absolute",
            display: "flex",
            bottom: 30,
            // This causes whole card row to move left on spread
            left: x - (spread / 2) * handCards.length,
            top: y,
            transition: "180ms",
            height: dimensions.cardHeight,
          }}
          ref={provided.innerRef}
        >
          {handCards.map((card, index) => (
            <div
              // This is a container div for one card and one spacer
              style={{ height: dimensions.cardHeight, display: "flex", position: "relative" }}
            > {index > 0 ? (
              <div
                // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                style={{ width: spread, transition: "all 180ms", height: dimensions.cardHeight}}
              />
            ) : null}
              <HandCard
                id={card.id}
                index={index}
                image={card.image}
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
