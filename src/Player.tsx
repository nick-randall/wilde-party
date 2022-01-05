import getPlayersLayout from "./dimensions/getPlayersLayout";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { SpecialsZone } from "./SpecialsZone";
import UWZ from "./UWZ";

interface PlayerProps {
  id: string;
  screenSize: { width: number; height: number };
  places: PlayerPlaces;
}

const Player = (props: PlayerProps) => {
  const { screenSize, id, places } = props;

  const {width, height, x, y} = getPlayersLayout(screenSize, id)
  return (
    <div style = {{position: "relative", left:x, top: y}}>
      <div style={{ display: "block" }}>
        <SpecialsZone id={places.specialsZone.id} specialsCards={places.specialsZone.cards} />
        <div>
          <GCZ
            id={places.GCZ.id}
            enchantmentsRowCards={places.enchantmentsRow.cards}
            GCZCards={places.GCZ.cards}
          />
        </div>
        <Hand id={places.hand.id} handCards={places.hand.cards} />
      </div>
      <UWZ id={places.UWZ.id} unwantedCards={places.UWZ.cards} />
      {/* <Player player = {gameSnapshot.players[0]}/> */}
    </div>
  );
};
export default Player;
