import { connect, useSelector } from "react-redux";
import { getDimensions } from "../helperFunctions/getDimensions";
import MockRenderProvider from "../mockRender/MockRenderProvider";
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

  return (
    <MockRenderProvider player={player} placeType="GCZ" placeId={id}>
      {(cards, mockRenderIds) => (
        <div className={devSettings.grid.on ? "place-grid" : ""} style={{ left: 200, position: "relative", height: dimensions.cardHeight }}>
          {cards.map((card, index) =>
            mockRenderIds.includes(card.id) ? (
              <TableCardMockRender cardId={card.id} index={index} dimensions={dimensions} />
            ) : (
              <div style={{ left: index * dimensions.cardLeftSpread, position: "absolute" }} key={card.id}>
                <Card dimensions={dimensions} id={card.id} index={index} image={card.image} placeId={id} placeType="GCZ"/>)
              </div>
            )
          )}
        </div>
      )}
    </MockRenderProvider>
  );
};

// const mapStateToProps = (state: RootState, ownProps: EnemyGCZProps) => {
//   const { gameSnapshot, newSnapshots, draggedState, highlights, draggedHandCard } = state;
//   const { draggedId } = draggedState;
//   const { id, player } = ownProps;

//   let enemyGCZCards = gameSnapshot.players[player].places.GCZ.cards;
//   let emissaryCardIndex;
//   if (newSnapshots.length > 0) {
//     newSnapshots[0].animationTemplates.forEach(template => {
//       // if place contains a card transitioning to or from it..

//       const placeId = "placeId" in template.to ? template.to.placeId : undefined; // will this work???
//       if (placeId === id) {
//         //TODO sort somtehing like this:
//         // if (template.to.placeId === id || template.from.placeId === id) {

//         if (template.status !== "waitingInLine") {
//           // this path should be figured out with
//           // player slash place data;

//           // Listen to next newSnapshot in line rather than currSnapshot

//           enemyGCZCards = newSnapshots[0].players[player].places.GCZ.cards;
//           console.log("listening to newSnapshot");
//           if (template.status === "awaitingEmissaryData") {
//             emissaryCardIndex = enemyGCZCards.map(card => card.id).indexOf(template.to.cardId);
//           }
//         }
//       }
//     });
//   }
//   return { emissaryCardIndex, enemyGCZCards };
// };

export default EnemyGCZ;

// export default EnemyGCZ;
