import Deck from "./Deck";
import DiscardPile from "./DiscardPile";

interface NonPlayerPlacesProps {
  places: NonPlayerPlaces;
  screenSize: { width: number; height: number };
}

const NonPlayerPlaces = (props: NonPlayerPlacesProps) => {
  const { places } = props;

  return (
    <div style={{// position: "absolute", left: x, top: y, width: width, height: height, 
    // border: "thin black solid",
    gridRowEnd: "span 2",
    display: "block" }}>
      <Deck id={places.deck.id} cards={places.deck.cards} />
      <DiscardPile id={places.discardPile.id} />
    </div>
  );
};
export default NonPlayerPlaces;
