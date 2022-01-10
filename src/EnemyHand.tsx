import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import EnemyHandCard from "./EnemyHandCard";
interface EnemyHandProps {
  id: string;
  handCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

const transitionData: TransitionData[] = [];

const EnemyHand = (props: EnemyHandProps) => {
  const { id, handCards, playerZoneSize } = props;
  const dimensions = getAllDimensions(id);
  const maxCardLeftSpread = dimensions.maxCardLeftSpread || 0;
  const handCardDragged = useSelector((state: RootState) => state.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.transitionData.length > 0);
  const spread = dimensions.cardLeftSpread;
  


  const { x, y } = getPlacesLayout(id, playerZoneSize);
  return (
    
        <div
          id={props.id}
         
          style={{
            position: "absolute",
            display: "flex",
            bottom: 30,
            // This causes whole card row to move left on spread
            left: x - (spread / 2 - 0.5) * handCards.length,
            //left: x - (spread / 2) * handCards.length,
            top: y,
            transition: "180ms",
            height: dimensions.cardHeight,
          }}
        >
          {handCards.map((card, index) => (
            <div
              // This is a container div for one card and two spacers
              style={{ height: dimensions.cardHeight, display: "flex", position: "relative" }}
            >
              <div
                // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                style={{
                  width: spread / 2,
                  transition: "all 180ms",
                  height: dimensions.cardHeight,
                  // border:"thin green solid",
                  // zIndex: 100
                }}
              />
              <EnemyHandCard id={card.id} index={index} image={card.image} dimensions={dimensions} numHandCards={handCards.length} key={card.id} />

              <div
                // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                style={{
                  width: spread / 2,
                  transition: "all 180ms",
                  height: dimensions.cardHeight,
                  // border:"thin red solid",
                  // zIndex: 100
                }}
              />
            </div>
          ))}
        
        </div>
      )}



export default EnemyHand;
