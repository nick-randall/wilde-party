import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
interface HandProps {
  id: string;
  handCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

const transitionData: TransitionData[] = [];

const Hand = (props: HandProps) => {
  const { id, handCards, playerZoneSize } = props;
  const [shouldSpread, setShouldSpread] = useState(false);
  const dimensions = getAllDimensions(id);
  const { cardLeftSpread } = dimensions;
  const maxCardLeftSpread = dimensions.maxCardLeftSpread || 0;
  const [spread, setSpread] = useState(cardLeftSpread);
  const handCardDragged = useSelector((state: RootState) => state.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.transitionData.length > 0);
  const enemysTurn = useSelector((state: RootState) => state.gameSnapshot.current.player !== 0);

  useEffect(() => {
    if (shouldSpread) {
      if (!transitionsUnderway && !handCardDragged && !enemysTurn) setSpread(maxCardLeftSpread);
    } else {
      setSpread(cardLeftSpread);
    }
  }, [transitionsUnderway, shouldSpread, handCardDragged, maxCardLeftSpread, cardLeftSpread, enemysTurn]);

  const { x, y } = getPlacesLayout(id, playerZoneSize);
  return (
    <Droppable droppableId={id} direction="horizontal" isDropDisabled={true}>
      {provided => (
        <div
          id={props.id}
          onMouseEnter={() => setShouldSpread(true)}
          onMouseLeave={() => setShouldSpread(false)}
          style={{
            position: "absolute",
            display: "flex",
            bottom: 30,
            // This causes whole card row to move left on spread
            left: x - (spread / 2 - 0.5) * handCards.length,
            //left: x - (spread / 2) * handCards.length,
            top: y,
            transition: "180ms",
            height: dimensions.cardHeight,
          }}
          ref={provided.innerRef}
        >
          {handCards.map((card, index) => (
            <div
              // This is a container div for one card and two spacers
              style={{ height: dimensions.cardHeight, display: "flex", position: "relative" }}
            >
              <div
                // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                style={{
                  width: spread / 2,
                  transition: "all 180ms",
                  height: dimensions.cardHeight,
                  // border:"thin green solid",
                  // zIndex: 100
                }}
              />
              <HandCard id={card.id} index={index} image={card.image} dimensions={dimensions} numHandCards={handCards.length} key={card.id} />

              <div
                // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                style={{
                  width: spread / 2,
                  transition: "all 180ms",
                  height: dimensions.cardHeight,
                  // border:"thin red solid",
                  // zIndex: 100
                }}
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
