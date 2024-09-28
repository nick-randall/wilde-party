import { useSelector } from "react-redux";
import { getCardStyleValues } from "../helperFunctions/getCardStyles";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";

export interface GhostCardGroupProps {
  index: number;
  ghostCardGroup: CardGroupObj;
}

interface CardOffset {
  left: number;
  top: number;
}

const GhostCardGroup = (props: GhostCardGroupProps) => {
  const { ghostCardGroup, index } = props;
  const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
  const { cardHeight, left } = getCardStyleValues(ghostCardGroup.id, currSnapshot);

  
  const getOffset = (card: GameCard, ghostCardGroupIndex: number): CardOffset => {
    if (card.cardType === "bff") return { top: cardHeight / 2, left: left / 2 };
    if (card.cardType === "zwilling") return { top: cardHeight / 2, left: 0 };
    if (ghostCardGroupIndex > 0) return { top: 0, left: left };
    return { top: 0, left: 0 };
  };
  console.log(ghostCardGroup);

  return (
    <div id={`ghostcard-absolute-positioning-container${ghostCardGroup}`} style={{ position: "absolute", zIndex: 0 }}>
      <div id={`ghostcard-relative-positioning-container${ghostCardGroup}`} style={{ position: "relative" }}>
        {ghostCardGroup.cards.map((ghostCard, ghostCardGroupIndex) => (
          <GhostCard
            cardId={ghostCardGroup.id}
            index={index}
            imageName={ghostCard.imageName}
            key={ghostCard.id}
            offsetLeft={getOffset(ghostCard, ghostCardGroupIndex).left}
            offsetTop={getOffset(ghostCard, ghostCardGroupIndex).top}
            zIndex={5}
          />
        ))}
      </div>
    </div>
  );
};
export default GhostCardGroup;
