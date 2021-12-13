import { getAllDimensions } from "./helperFunctions/getDimensions";
import EnemyCard from "./EnemyCard";

interface EnemyHandProps {
  id: string;
  handCards: GameCard[];
}

export const EnemyHand = (props: EnemyHandProps) => {
  const { id, handCards } = props;
  const dimensions = getAllDimensions(id);
  return (
    <div>
      {handCards.map((card, index) => (
        <EnemyCard id={card.id} index={index} image={"../images/back.jpg"} dimensions={dimensions} numHandCards={handCards.length} />
      ))}
    </div>
  );
};
