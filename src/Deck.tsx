import { useDispatch, useSelector } from "react-redux";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { enactDrawCardEvent } from "./redux/actionCreators";
import { RootState } from "./redux/store";
import { drawCardThunk } from "./redux/thunks";

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
  const canDraw = player === 0 && draws > 0 && cards.length > 0;
  const handleClick = () => {
    if (canDraw) dispatch(drawCardThunk(0));
  };
  console.log(x);
  return (
    <div style={{ left: x, top: y, position: "absolute" }} onClick={handleClick}>
      {cards.length > 0 ? <input type="image" src="./images/back.jpg" alt="deck" style={{ height: dimensions.cardHeight }} /> : null}
    </div>
  );
};
