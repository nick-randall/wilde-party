import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import { RootState } from "../redux/store";
import { drawCardThunk } from "../redux/thunks";
import "../css/grid.css";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";

interface DeckProps {
  id: number;
  cards: GameCard[];
  // zoneSize: { width: number; height: number };
}

export const Deck = (props: DeckProps) => {
  const { id, cards } = props;
  const dispatch = useDispatch();
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const dimensions = getCardStyleValuesFromPlaceAndPlayer("deck", null, currSnapshot);
  const { player, draws, phase } = useSelector((state: RootState) => state.dragEventState.gameSnapshot.current);
  const canDraw = player === 0 && phase === "drawPhase" && draws > 0 && cards.length > 0;
  const handleClick = () => {
    if (canDraw) dispatch(drawCardThunk(0));
  };

  const cardsInReverseOrder = Array.from(cards).reverse();

  const highlightStyles = canDraw
    ? {
        backgroundColor: "yellowgreen",
        boxShadow: "0px 0px 30px 30px yellowgreen",
        transition: "background-color 180ms, box-shadow 180ms, left 180ms",
      }
    : {};

  return (
    <div style={{ height: dimensions.cardHeight, width: dimensions.cardWidth, position: "absolute", ...highlightStyles }} onClick={handleClick}>
      {cardsInReverseOrder.map((card, index) => (
        <Card key={card.id} id={card.id} index={index} imageName="back" />
      ))}
    </div>
  );
};
