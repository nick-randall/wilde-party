import { useSelector } from "react-redux";
import { getDimensions } from "../helperFunctions/getDimensions";
import HandCardMockRender from "../mockRender/HandCardMockRender";
import MockRenderProvider from "../mockRender/MockRenderProvider";
import { RootState } from "../redux/store";
import EnemyHandCard from "./EnemyHandCard";
interface EnemyHandProps {
  id: string;
  player: number;
  placeType: PlaceType;
}

const transitionData: TransitionData[] = [];

const EnemyHand: React.FC<EnemyHandProps> = ({ id, player, placeType }) => {
  // const { id,  playerZoneSize } = props;
  const dimensions = getDimensions(player, placeType);
  const { cardLeftSpread } = dimensions;
  const maxCardLeftSpread = dimensions.maxCardLeftSpread || 0;
  const handCardDragged = useSelector((state: RootState) => state.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.transitionData.length > 0);
  const devSettings = useSelector((state: RootState) => state.devSettings);

  const spread = cardLeftSpread;

  return (
    <MockRenderProvider placeId={id} player={player} placeType={"hand"}>
      {(handCards, mockRenderIds) => (
        <div
        className= {devSettings.grid.on ? "place-grid hand-grid" : ""}
          id={id}
          style={{
            position: "relative",
            // display: "flex",
            // This causes whole card row to move left on spread
            // left: cardLeftSpread * handCards.length,
            // left: (spread / 2) * handCards.length,
            // top: y,  
            border: "dotted blue thick",
            transition: "180ms",
            height: dimensions.cardHeight,
          }}
        >
          {handCards.map((card, index) =>
            mockRenderIds.includes(card.id) ? (
              <HandCardMockRender dimensions={dimensions} cardId={card.id} index={index} numHandCards={handCards.length} spread={spread} />
            ) : (
              <EnemyHandCard
                id={card.id}
                index={index}
                image={card.image}
                dimensions={dimensions}
                numHandCards={handCards.length}
                key={card.id}
                spread={spread}
              />
            )
          )}
        </div>
      )}
    </MockRenderProvider>
  );
};

export default EnemyHand;
