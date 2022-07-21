import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { NoLayoutDragContainer } from "./dndcomponents/NoLayoutDragContainer";
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
  const dimensions = getDimensions(0, "hand");
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
    
      <MockRenderProvider player={0} placeType="hand" placeId={id}>
        {(handCards, mockRenderIds) => (
          <div
          id={props.id}
          onMouseEnter={() => setShouldSpread(true)}
          onMouseLeave={() => setShouldSpread(false)}
          style={{
            // position: "relative",
            // display: "flex",
            // alignContent: "center",
            // bottom: 30,
            // This causes whole card row to move left on spread
            // left: cardLeftSpread * handCards.length,
            //left: x - (spread / 2) * handCards.length,
            // top: y,
            border: "blue solid 2px",
            transition: "380ms",
            height: dimensions.cardHeight,
          }}
        >
          <NoLayoutDragContainer>
            {handCards.map((card, index) =>
              mockRenderIds.includes(card.id) ? (
                <HandCardMockRender
                  cardId={card.id}
                  index={index}
                  dimensions={dimensions}
                  numHandCards={handCards.length}
                  spread={spread}
                  key={"mock_render" + card.id}
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
          </div>  )}  
      </MockRenderProvider>
  
  );
};
export default Hand;
