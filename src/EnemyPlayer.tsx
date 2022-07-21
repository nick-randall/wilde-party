import EnemyGCZ from "./EnemyGCZ";
import EnemyHand from "./EnemyHand";
import GCZ from "./GCZ";
import Hand from "./Hand";
import countPlayerPoints from "./helperFunctions/locateFunctions/countPlayerPoints";
import { SpecialsZone } from "./SpecialsZone";
import UWZ from "./UWZ";

interface PlayerProps {
  id: string;
  screenSize: { width: number; height: number };
  places: PlayerPlaces;
  player: number;
  current: boolean;
}

const EnemyPlayer = (props: PlayerProps) => {
  const { screenSize, id, places, current, player } = props;
  const playerPoints = countPlayerPoints(id);

  return (
    <div
      style={{
        //position: "absolute", left: x, top: y, width: width, height:height,
        border: "thin black solid",
        display: "grid",
        justifyContent: "center",
        gridTemplateColumns: "1fr 1 fr",
      }}
    >

      <EnemyGCZ
        id={places.GCZ.id}
        enchantmentsRowCards={places.enchantmentsRow.cards}
        // GCZCards={places.GCZ.cards}
        player={player}
      />
        <EnemyHand id={places.hand.id} player={player} placeType="hand" />
        <SpecialsZone id={places.specialsZone.id} specialsCards={places.specialsZone.cards} />

      <UWZ id={places.UWZ.id} unwantedCards={places.UWZ.cards} />
      <div style={{ color: "white", fontSize: 50, position: "relative" }}>
        {playerPoints}
        {playerPoints === 1 ? "Punkt" : "Punkte"}
      </div>
      {/* <Player player = {gameSnapshot.players[0]}/> */}
    </div>
  );
};
export default EnemyPlayer;
