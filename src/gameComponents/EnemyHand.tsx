import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { getAllDimensions } from "../helperFunctions/getDimensions";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EnemyHandCard from "./EnemyHandCard";
interface EnemyHandProps {
  id: number;
  handCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

const transitionData: TransitionData[] = [];

const EnemyHand = (props: EnemyHandProps) => {
  const { id, handCards, playerZoneSize } = props;
  const dimensions = getAllDimensions(id);
  const maxCardLeftSpread = dimensions.maxCardLeftSpread || 0;
  const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.dragEventState.transitionData.length > 0);
  const spread = dimensions.cardLeftSpread;

  return (
    <div
      style={{
        position: "absolute",
        // display: "flex",
        bottom: 30,
        // This causes whole card row to move left on spread
        //left: x - (spread / 2) * handCards.length,
        transition: "180ms",
        height: dimensions.cardHeight,
      }}
    >
      {handCards.map((card, index) => (

        <EnemyHandCard id={card.id} index={index} imageName={card.imageName} dimensions={dimensions} numHandCards={handCards.length} key={card.id} />
      ))}
    </div>
  );
};

export default EnemyHand;
