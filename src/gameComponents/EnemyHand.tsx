import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EnemyHandCard from "./EnemyHandCard";
import { dimensionConstants, getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
interface EnemyHandProps {
  id: number;
  handCards: GameCard[];
  player: number;
  registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const EnemyHand = (props: EnemyHandProps) => {
  const { id, handCards, player, registerPlaceOffset } = props;
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const styles = getCardStyleValuesFromPlaceAndPlayer("hand", player, currSnapshot);
  const maxCardLeftSpread = dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD;
  const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.dragEventState.transitionData.length > 0);
  const spread = styles.left;

  return (
    <div
      style={{
        position: "relative",
        // display: "flex",
        // This causes whole card row to move left on spread
        //left: x - (spread / 2) * handCards.length,
        transition: "180ms",
        height: styles.cardHeight,
      }}
      ref={el => registerPlaceOffset(el, id)}
    >
      {handCards.map((card, index) => (

        <EnemyHandCard id={card.id} index={index} imageName={card.imageName} key={card.id} />
      ))}
    </div>
  );
};

export default EnemyHand;
