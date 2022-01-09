import getPlayersLayout from "./dimensions/getPlayersLayout";
import { EnemyHand } from "./EnemyHand";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { SpecialsZone } from "./SpecialsZone";
import UWZ from "./UWZ";

interface PlayerProps {
  id: string;
  screenSize: { width: number; height: number };
  places: PlayerPlaces;
  current: boolean
}

const EnemyPlayer = (props: PlayerProps) => {
  const { screenSize, id, places, current } = props;
  const { width, height, x, y } = getPlayersLayout(screenSize, id);


  return (
    <div style={{ position: "absolute", left: x, top: y, width: width, height:height, border: "thin black solid", display:"block"}}>
        <SpecialsZone id={places.specialsZone.id} specialsCards={places.specialsZone.cards} playerZoneSize={{ width, height }} />
        <div>
          <GCZ
            id={places.GCZ.id}
            enchantmentsRowCards={places.enchantmentsRow.cards}
            GCZCards={places.GCZ.cards}
            playerZoneSize={{ width, height }}
          />
        </div>
        <EnemyHand id={places.hand.id} handCards={places.hand.cards} playerZoneSize={{ width, height }} />
     
      <UWZ id={places.UWZ.id} unwantedCards={places.UWZ.cards} playerZoneSize={{ width, height }} />
      {/* <Player player = {gameSnapshot.players[0]}/> */}
    </div>
  );
};
export default EnemyPlayer;