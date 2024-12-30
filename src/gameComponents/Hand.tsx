import { forwardRef, useEffect, useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { dimensionConstants, getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import { RefMap } from "../animations/animationHelperFunctions";
import AnimatedCard from "./AnimatedCard";
interface HandProps {
  id: number;
  handCards: GameCard[];
}

const Hand = forwardRef<RefMap, HandProps>((props, refMap) => {
  const refCallback = (el: HTMLElement | null, id: number) => {
    if (!refMap) return;
    if (typeof refMap == "function") return;
    if (!refMap.current) return;
    if (el === null) return;
    refMap.current[id] = el;
  };
  const { id, handCards } = props;
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

  const { activeAnimation, newSnapshot, snapshots } = useSelector((state: RootState) => state.gameSnapshotState);
  const animations = activeAnimation?.animations ?? [];
  const animationCardIds = animations.filter(ani => ani.placeId === id).map(ani => ani.cardId);
  const snapshot = !activeAnimation?.showPrevSnapshot && newSnapshot !== undefined ? newSnapshot : currSnapshot;

  useEffect(() => {
    if (shouldSpread) {
      if (!transitionsUnderway && !handCardDragged && !enemysTurn) setSpread(maxCardLeftSpread);
    } else {
      setSpread(cardLeftSpread);
    }
  }, [transitionsUnderway, shouldSpread, handCardDragged, maxCardLeftSpread, cardLeftSpread, enemysTurn]);

  return (
    <Droppable droppableId={droppableId} direction="horizontal" isDropDisabled={true}>
      {provided => (
        <div ref={provided.innerRef}>
          <div
            className="grid-item center"
            onMouseEnter={() => setShouldSpread(true)}
            onMouseLeave={() => setShouldSpread(false)}
            key={droppableId}
            style={{
              position: "relative",
              minWidth: 0, // This stops the whole grid expanding with the cards
              display: "flex",
              bottom: 30,
              // This causes whole card row to move left on spread
              // left: (-spread / 2 - 0.5) * handCards.length,
              //left: x - (spread / 2) * handCards.length,
              transition: "180ms",
              height: styles.cardHeight,
            }}
            ref={el => refCallback(el, id)}
          >
            {handCards.map((card, index) =>
              animationCardIds.includes(card.id) ? (
                <AnimatedCard ref={refMap} id={card.id} index={index} image={card.imageName} currAnimations={animations} gameSnapshot={snapshot} />
              ) : (
                <div
                  key={"handcard" + card.id}
                  // This is a container div for one card and two spacers
                  style={{ height: styles.cardHeight, display: "flex", position: "relative" }}
                >
                  <div
                    // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                    style={{
                      width: spread / 2,
                      transition: "all 180ms",
                      height: styles.cardHeight,
                      // border:"thin green solid",
                      // zIndex: 100
                    }}
                  />
                  <HandCard id={card.id} index={index} imageName={card.imageName} numHandCards={handCards.length} key={card.id} />

                  <div
                    // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                    style={{
                      width: spread / 2,
                      transition: "all 180ms",
                      height: styles.cardHeight,
                      // border:"thin red solid",
                      // zIndex: 100
                    }}
                  />
                </div>
              )
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
});

export default Hand;
