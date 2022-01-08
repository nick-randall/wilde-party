import { useDispatch, useSelector } from "react-redux";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { enactDrawCardEvent } from "./redux/actionCreators";
import { RootState } from "./redux/store";
import { drawCard } from "./redux/thunks";

interface DeckProps {
  id: string;
  cards: GameCard[];
  zoneSize: { width: number; height: number };
}

export const Deck = (props: DeckProps) => {
  const { id, zoneSize, cards } = props;
  const { x, y } = getPlacesLayout(id, zoneSize);
  const dispatch = useDispatch();
  const dimensions = getAllDimensions(id);
  const { player, draws } = useSelector((state: RootState) => state.gameSnapshot.current);
  const canDraw = player === 0 && draws > 0;
  const handleClick = () => {
    if (canDraw) dispatch(drawCard(0));
  };
  console.log(x);
  return (
    <div style={{ left: x, top: y, position: "absolute" }} onClick={handleClick}>
      {/* <Card id={""} index={0} image= "back" dimensions={dimensions} /> */}
      <input type="image" src="./images/back.jpg" alt="deck" style={{ height: dimensions.cardHeight }} />
    </div>
  );
};
