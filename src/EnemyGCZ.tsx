import { connect } from "react-redux";
import Card from "./Card";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";
import TableCardEmissary from "./TableCardEmissary";

type EnemyGCZProps = {
  id: string;
  enchantmentsRowCards: GameCard[];
  // GCZCards: GameCard[];
  player: number;
  playerZoneSize: { width: number; height: number };
};

type EnemyGCZReduxProps = {
  emissaryCardIndex?: number
  enemyGCZCards: GameCard[]
};

const EnemyGCZ = (props: EnemyGCZProps & EnemyGCZReduxProps) => {
  const { enemyGCZCards, enchantmentsRowCards, id, playerZoneSize, emissaryCardIndex } = props;
  const { x, y } = getPlacesLayout(id, playerZoneSize);
  const dimensions = getAllDimensions(id);
  return (
    <div style={{ left: x, top: y, position: "absolute" }}>
      {enemyGCZCards.map((card, index) => (
         emissaryCardIndex === index ? (
          <TableCardEmissary
            id={card.id}
            index={index}
            image={card.image}
            dimensions={dimensions}
            placeId={id}
            key={"emissary" + card.id}
          />
        ) :
        <div style={{ left: index * dimensions.cardLeftSpread, position: "absolute" }} key={card.id}>
          <Card dimensions={dimensions} id={card.id} index={index} image={card.image} placeId={id} />)
        </div>
      ))}
      <div style={{ top: dimensions.cardHeight / 2, position: "absolute" }}>
        {enchantmentsRowCards.map(card => (
          <div style={{ left: card.index * dimensions.cardLeftSpread, position: "absolute" }} key={card.id}>
            <Card dimensions={dimensions} id={card.id} index={card.index} image={card.image} placeId={id} />
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: EnemyGCZProps) => {
  const { gameSnapshot, newSnapshots, draggedId, highlights, draggedHandCard } = state;
  const { id, player } = ownProps;

  let enemyGCZCards = gameSnapshot.players[player].places.GCZ.cards;
  let emissaryCardIndex;
  if (newSnapshots.length > 0) {
    newSnapshots[0].transitionTemplates.forEach(template => {
      // if place contains a card transitioning to or from it..
      if (template.to.placeId === id) {
        //TODO sort somtehing like this:
        // if (template.to.placeId === id || template.from.placeId === id) {

        if (template.status !== "waitingInLine") {
          // this path should be figured out with
          // player slash place data;

          // Listen to next newSnapshot in line rather than currSnapshot

          enemyGCZCards = newSnapshots[0].players[player].places.GCZ.cards;
          console.log("listening to newSnapshot");
          if (template.status === "awaitingEmissaryData") {
            emissaryCardIndex = enemyGCZCards.map(card => card.id).indexOf(template.to.cardId);
          }
        }
      }
    });
  }
  return {emissaryCardIndex, enemyGCZCards}
};

export default connect(mapStateToProps)(EnemyGCZ);

// export default EnemyGCZ;
