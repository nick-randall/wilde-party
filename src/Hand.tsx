import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { NoLayoutDragContainer } from "./dndcomponents/NoLayoutDragContainer";
import HandCardEmissary from "./HandCardEmissary";
import EmissaryHandler from "./transitionFunctions/EmissaryHandler";
import MultiEmissaryHandler from "./transitionFunctions/MultiEmissaryHandler";
interface HandProps {
  id: string;
  playerZoneSize: { width: number; height: number };
}

// type HandReduxProps = {
//   draggedId?: string;
//   emissaryCardIndex?: number;
//   handCards: GameCard[];
//   // numElementsAt: number[];
//   // elementWidthAt: number[];
// };

const Hand = (props: HandProps) => {
  const { id, playerZoneSize } = props;
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
      {" "}
      <MultiEmissaryHandler player={0} placeType="hand" placeId={id}>
        {(handCards, emissaryCards, silentEmissaryCards) => (
          <NoLayoutDragContainer>
            {handCards.map((card, index) =>
              emissaryCards.includes(card.id) || silentEmissaryCards.includes(card.id) ? (
                <HandCardEmissary
                  id={card.id}
                  silent={silentEmissaryCards.includes(card.id)}
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
                  handId={id} // TODO: need to use NewSnapshotID somehow (maybe in getDimensions???)
                  spread={spread}
                />
              )
            )}
          </NoLayoutDragContainer>
        )}
      </MultiEmissaryHandler>
    </div>
  );
};
export default Hand;
