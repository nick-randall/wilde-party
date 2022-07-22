import { useSelector } from "react-redux";
import GCZ from "./GCZ";
import Hand from "./Hand";
import countPlayerPoints from "./helperFunctions/locateFunctions/countPlayerPoints";
import { RootState } from "./redux/store";
import { SpecialsZone } from "./SpecialsZone";
import UWZ from "./UWZ";

interface PlayerProps {
  id: string;
  screenSize: { width: number; height: number };
  places: PlayerPlaces;
  current: boolean;
}

const Player = (props: PlayerProps) => {
  const { screenSize, id, places, current } = props;
  const playerPoints = countPlayerPoints(id);
  const devSettings = useSelector((state: RootState) => state.devSettings);

  return (
    <div
      className={devSettings.grid.on ? "player-grid" : ""}
      style={{
        //position: "absolute", left: x, top: y, width: width, height:height,
        // border: "thin black solid",
        // gridRowStart: "span 2",
        gridRowEnd: "span 2",
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        flexDirection: "column",
        // gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* <SpecialsZone id={places.specialsZone.id} specialsCards={places.specialsZone.cards} playerZoneSize={{ width, height }} /> */}

      <GCZ id={places.GCZ.id} />

      <Hand id={places.hand.id} />

      {/* <UWZ id={places.UWZ.id} unwantedCards={places.UWZ.cards} playerZoneSize={{ width, height }} /> */}

      {/* <div style={{ color: "white", fontSize: 50, position: "absolute" }}>
        Punkte:
        <span>{playerPoints}</span> */}
      {/* </div> */}
      {/* <Player player = {gameSnapshot.players[0]}/> */}
    </div>
  );
};
export default Player;
