import { Deck } from "./Deck";
import getPlayersLayout from "./dimensions/getPlayersLayout";

interface NonPlayerPlacesProps {
  places: NonPlayerPlaces;
  screenSize: { width: number; height: number };
}

const NonPlayerPlaces = (props: NonPlayerPlacesProps) => {
  const { places, screenSize } = props;
  const { width, height, x, y } = getPlayersLayout(screenSize, null);

  return (
    <div style={{ position: "absolute", left: x, top: y, width: width, height: height, border: "thin black solid", display: "block" }}>
      <Deck id={places.deck.id} cards={places.deck.cards} zoneSize={{ width: width, height: height }} />
    </div>
  );
};
export default NonPlayerPlaces;
