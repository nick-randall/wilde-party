import { useDispatch } from "react-redux";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";

interface DeckProps {
  id: string;
  cards: GameCard[];
  zoneSize: {width: number, height: number}
  
}

export const Deck = (props: DeckProps) => {
  const { id, zoneSize, cards } = props;
  const {x,y} = getPlacesLayout(id, zoneSize)
  const dispatch = useDispatch();
  const dimensions = getAllDimensions(id);
  const handleClick = () => {
    console.log("clicked on deck");
    dispatch({ type: "DRAW_CARD", payload: id });
  };
console.log(x)
  return(
    <div style={{left: x, top: y, position: "absolute"}} onClick={handleClick} >
      {/* <Card id={""} index={0} image= "back" dimensions={dimensions} /> */}
    <input type="image" src="./images/back.jpg" alt="deck" style={{ height: dimensions.cardHeight }} onClick={handleClick}  />
</div>)
};
