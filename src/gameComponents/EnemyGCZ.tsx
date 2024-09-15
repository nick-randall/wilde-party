import { useSelector } from "react-redux";
import { getCardStyleValues } from "../helperFunctions/getCardStyles";
import Card from "./Card";
import { RootState } from "../redux/store";

interface EnemyGCZProps {
  id: number;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  alignment: string;
}

const EnemyGCZ = (props: EnemyGCZProps) => {
  const { GCZCards, enchantmentsRowCards, id, alignment } = props;
  const {currSnapshot}  = useSelector((state: RootState) => state.gameSnapshotState);
  const styles = getCardStyleValues(id, currSnapshot);
  return (
    <div className={`grid-item ${alignment}`}>
      {GCZCards.map((card, index) => (
        <div key={card.id} style={{ left: index * styles.left, position: "absolute" }}>
          <Card id={card.id} index={index} imageName={card.imageName} />
        </div>
      ))}
      <div style={{ top: styles.cardHeight / 2, position: "absolute" }}>
        {enchantmentsRowCards.map(card => (
          <div key={card.id} style={{ left: card.index * styles.left, position: "absolute" }}>
            <Card id={card.id} index={card.index} imageName={card.imageName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnemyGCZ;
