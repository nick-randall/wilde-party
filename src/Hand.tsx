import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { getAllDimensions } from "./helperFunctions/getAllDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { NoLayoutDragContainer } from "./dndcomponents/NoLayoutDragContainer";
import HandCardEmissary from "./HandCardEmissary";
import EmissaryHandler from "./transitionFunctions/EmissaryHandler";
import MultiEmissaryHandler from "./transitionFunctions/MultiEmissaryHandler";
import { getDimensions } from "./helperFunctions/getDimensions";
import MockRenderProvider from "./mockRender/MockRenderProvider";
import HandCardMockRender from "./mockRender/HandCardMockRender";
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
  const dimensions = getDimensions("hand", 0);
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
      <MockRenderProvider player={0} placeType="hand" placeId={id}>
        {(handCards, emissaryCards) => (
          <NoLayoutDragContainer>
            {handCards.map((card, index) =>
              emissaryCards.includes(card.id) ? (
                <HandCardMockRender
                  cardId={card.id}
                  silent={false}
                  index={index}
                  dimensions={getDimensions("hand", 0, handCards.length)}
                  numHandCards={handCards.length}
                  spread={spread}
                  key={"emissary" + card.id}
                />
              ) : (
                <HandCard
                  id={card.id}
                  index={index}
                  image={card.image}
                  dimensions={getDimensions("hand", 0, handCards.length)}
                  numHandCards={handCards.length}
                  key={card.id}
                  handId={id} // TODO: need to use NewSnapshotID somehow (maybe in getDimensions???)
                  spread={spread}
                />
              )
            )}
          </NoLayoutDragContainer>
        )}
      </MockRenderProvider>
    </div>
  );
};
export default Hand;
