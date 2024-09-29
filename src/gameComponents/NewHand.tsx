import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { dimensionConstants, getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import { NewHandCard } from "./NewHandCard";

interface NewHandProps {
  id: number;
  handCards: GameCard[];
}
const NewHand: React.FC<NewHandProps> = ({ id, handCards }) => {
  const [shouldSpread, setShouldSpread] = useState(false);
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const styles = getCardStyleValuesFromPlaceAndPlayer("hand", 0, currSnapshot);
  const { left: cardLeftSpread } = styles;
  const maxCardLeftSpread = dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD;
  const [spread, setSpread] = useState(cardLeftSpread);
  const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.dragEventState.transitionData.length > 0);
  const enemysTurn = useSelector((state: RootState) => state.gameSnapshotState.currSnapshot.current.player !== 0);
  const droppableId = JSON.stringify({ type: "place", id });

  const [hover, setHover] = useState(false);

  return (
    <Droppable droppableId={droppableId} isDropDisabled={true}>
      {p => (
        <div {...p.droppableProps} ref={p.innerRef}>
          <div
            style={{ position: "relative"}}
            // ref={el => refCallback(el, place.id)}
          >
            {handCards.map(
              (card, index) => (
                // !animationCardIds.includes(card.id) ? (
                <NewHandCard key={card.id} id={card.id} imageName={card.imageName} index={index} hover={hover} setHover={setHover} numHandCards={handCards.length} />
              )
              // : (
              //   <AnimatedCard
              //     key={card.id}
              //     ref={refMap}
              //     id={card.id}
              //     currAnimations={currAnimations.filter(a => a.cardId === card.id && a.placeId === place.id)}
              //     image={card.image}
              //     index={index}
              //     gameSnapshot={snapshot}
              //   />
              // )
            )}
          </div>
          {p.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default NewHand;
