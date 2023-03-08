import { useSelector } from "react-redux";
import { getDimensions } from "../helperFunctions/getDimensions";
import MockRenderProviderWithRearrange from "../mockRender/NewMockRenderProvider";
import TableCardMockRender from "../mockRender/TableCardMockRender";
import { RootState } from "../redux/store";
import Card from "./Card";

type EnemyGCZProps = {
  id: string;
  // enchantmentsRowCards: GameCard[];
  // GCZCards: GameCard[];
  player: number;
};

// type EnemyGCZReduxProps = {
//   emissaryCardIndex?: number;
//   enemyGCZCards: GameCard[];
// };

const EnemyGCZ = (props: EnemyGCZProps) => {
  const { id, player } = props;
  const dimensions = getDimensions(player, "GCZ");
  const devSettings = useSelector((state: RootState) => state.devSettings);
  const animationData = useSelector((state: RootState) => state.animationData);

  return (
    <MockRenderProviderWithRearrange player={player} placeType="GCZ" placeId={id}>
      {({ cards, prevSnapshotCards, mockRenderToIds, mockRenderFromIds }) => (
        <div style={{ position: "relative" }}>
          <div className={devSettings.grid.on ? "place-grid" : ""} style={{ left: 200, position: "absolute", height: dimensions.cardHeight }}>
            {cards.map((card, index) =>
              mockRenderToIds.includes(card.id) ? (
                <TableCardMockRender cardId={card.id} index={index} dimensions={dimensions} offsetLeft={index * dimensions.cardWidth} />
              ) : (
                <div style={{ left: index * dimensions.cardLeftSpread, position: "absolute" }} key={card.id}>
                  <Card
                    dimensions={dimensions}
                    id={card.id}
                    index={index}
                    image={card.image}
                    placeId={id}
                    placeType="GCZ"
                    // isPlaceHolder={animationData.map(ad => ad.cardId).includes(card.id)}
                  />
                </div>
              )
            )}
          </div>
          <div
            className={devSettings.grid.on ? "place-grid" : ""}
            style={{ left: 200, position: "absolute", height: dimensions.cardHeight }}
            // The fromIds layer, allowing rearranging. It only provides 
          >
            {prevSnapshotCards.map((card, index) =>
              mockRenderFromIds.includes(card.id) ? (
                <div style={{ left: index * dimensions.cardWidth, position: "absolute", backgroundColor: "blue" }}>
                  <TableCardMockRender
                    cardId={card.id}
                    index={index}
                    dimensions={dimensions}
                    // offsetLeft={index * dimensions.cardWidth}
                    toOrFrom={"from"}
                  />

                  {/* <Card dimensions={dimensions} id={card.id} index={index} image={card.image} placeId={id} placeType="GCZ" /> */}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </MockRenderProviderWithRearrange>
  );
};

export default EnemyGCZ;
