import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { connect, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import DraggerContainer from "./dndcomponents/DraggerContainer";
import { NoLayoutDragContainer } from "./dndcomponents/NoLayoutDragContainer";
import HandCardEmissary from "./HandCardEmissary";
interface HandProps {
  id: string;
  playerZoneSize: { width: number; height: number };
}

type HandReduxProps = {
  draggedId?: string;
  emissaryCardIndex?: number;
  handCards: GameCard[];
  // numElementsAt: number[];
  // elementWidthAt: number[];
};

const Hand = (props: HandProps & HandReduxProps) => {
  const { id, handCards, playerZoneSize, emissaryCardIndex } = props;
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
    <div
      id={props.id}
      onMouseEnter={() => setShouldSpread(true)}
      onMouseLeave={() => setShouldSpread(false)}
      style={{
        position: "absolute",
        display: "flex",
        bottom: 30,
        // This causes whole card row to move left on spread
        // left: x - (spread / 2 - 0.5) * handCards.length,
        //left: x - (spread / 2) * handCards.length,
        top: y,
        transition: "180ms",
        height: dimensions.cardHeight,
      }}
    >
      <NoLayoutDragContainer>
        {handCards.map((card, index) =>
          emissaryCardIndex === index ? (
            <HandCardEmissary
              id={card.id}
              index={index}
              image={card.image}
              dimensions={dimensions}
              numHandCards={handCards.length}
              spread={spread}
              key={"emissary" + card.id}
            />
          ) : (
            <HandCard
              id={card.id}
              index={index}
              image={card.image}
              dimensions={dimensions}
              numHandCards={handCards.length}
              key={card.id}
              handId={id}
              spread={spread}
            />
          )
        )}
      </NoLayoutDragContainer>
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: HandProps) => {
  const { gameSnapshot, newSnapshots } = state;
  const { id } = ownProps;
  // this path should be figured out with
  // player slash place data;
  let handCards = gameSnapshot.players[0].places.hand.cards;
  let emissaryCardIndex;

  if (newSnapshots.length > 0) {
    newSnapshots[0].transitionTemplates.forEach(template => {
      // if place contains a card transitioning to or from it..
      if (template.to.placeId === id) {
        //TODO sort somtehing like this:
        // if (template.to.placeId === id || template.from.placeId === id) {
        switch (template.status) {
          case "waitingInLine":
            break;

          case "awaitingEmissaryData":
            handCards = newSnapshots[0].players[0].places.hand.cards;
            console.log("listening to newSnapshot");
            emissaryCardIndex = handCards.map(handCard => handCard.id).indexOf(template.to.cardId);
            console.log("listening to newSnapshot and awaitingEmissary at index " + emissaryCardIndex);
            break;
          case "underway":
            console.log("listening to newSnapshot");
            handCards = newSnapshots[0].players[0].places.hand.cards;
          // case "complete" :
          //   break; ???
        }
      }
    });
  }
  return { handCards, emissaryCardIndex };
};
export default connect(mapStateToProps)(Hand);
