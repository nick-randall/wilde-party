import {  useSelector } from "react-redux";
import Card from "./Card";
import { getCardStyleValues } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";

interface DiscardPileProps {
  cards: GameCard[];
  id: number;
}

const DiscardPile = (props: DiscardPileProps) => {
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);

  const { id, cards } = props;
  const dimensions = getCardStyleValues(id, currSnapshot);
  return (
    <div>
      {cards.map((card, index) => (
        // <img src={card.imageName} alt={card.imageName} style={{ height: cardHeight, width: cardWidth }} />
        <Card id={card.id} key={card.id} index={0} imageName={card.imageName} offsetLeft={index* 3}/>
      ))}
    </div>
  );
};

export default DiscardPile;
