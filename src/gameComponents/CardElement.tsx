import { FC } from "react";
import HandCardMockRender from "../mockRender/HandCardMockRender";
import TableCardMockRender from "../mockRender/TableCardMockRender";
import Card from "./Card";
import EnemyCard from "./EnemyCard";
import EnemyHandCard from "./EnemyHandCard";
import HandCard from "./HandCard";
import PlaceHolder from "./Placeholder";

interface CardElementProps {
  card: GameCard;
  cardType: "tableCard" | "enemyTableCard" | "handCard" | "enemyHandCard";
  placeType: PlaceType;
  dimensions: AllDimensions;
  numHandCards?: number;
  spread?: number;
  cardElementDisplayType: "placeholder" | "mockToRender" | "mockFromRender" | "card";
}

const CardElement: FC<CardElementProps> = (props: CardElementProps) => {
  const { cardType, cardElementDisplayType, card, placeType, dimensions, spread, numHandCards } = props;
  switch (cardElementDisplayType) {
    case "card":
      if (cardType === "tableCard") {
        return <Card {...card} placeType={placeType} dimensions={dimensions} />;
      } else if (cardType === "handCard") {
        return <HandCard {...card} handId={card.placeId} dimensions={dimensions} numHandCards={numHandCards ?? 1} spread={spread ?? 0} />;
      } else if (cardType === "enemyHandCard") {
        return <EnemyHandCard {...card} dimensions={dimensions} numHandCards={numHandCards ?? 1} spread={spread ?? 0} />;
      } else {
        return <EnemyCard {...card} dimensions={dimensions} numHandCards={numHandCards ?? 1} />;
      }
    case "placeholder":
      return <PlaceHolder dimensions={dimensions} />;
    case "mockFromRender":
      if (placeType === "hand") {
        return (
          <HandCardMockRender cardId={card.id} index={card.index} dimensions={dimensions} numHandCards={numHandCards ?? 1} spread={spread ?? 0} />
        );
      } else {
        return <TableCardMockRender cardId={card.id} {...card} dimensions={dimensions} />;
      }
    case "mockToRender":
      if (cardType === "tableCard") {
        return <Card {...card} placeType={placeType} dimensions={dimensions} />;
      } else if (cardType === "handCard") {
        return <HandCard {...card} handId={card.placeId} dimensions={dimensions} numHandCards={numHandCards ?? 1} spread={spread ?? 0} />;
      } else if (cardType === "enemyHandCard") {
        return <EnemyHandCard {...card} dimensions={dimensions} numHandCards={numHandCards ?? 1} spread={spread ?? 0} />;
      } else {
        return <EnemyCard {...card} dimensions={dimensions} numHandCards={numHandCards ?? 1} />;
      }
  }
};

export default CardElement;
