import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import EnemyHandCard from "./EnemyHandCard";
import EmissaryHandler from "./transitionFunctions.ts/EmissaryHandler";
interface EnemyHandProps {
  id: string;
  player: number | null
  placeType: PlaceType
  playerZoneSize: { width: number; height: number };
}

const transitionData: TransitionData[] = [];

const EnemyHand: React.FC<EnemyHandProps> =  ({id, playerZoneSize, player, placeType}) => {
  // const { id,  playerZoneSize } = props;
  const dimensions = getAllDimensions(id);
  const maxCardLeftSpread = dimensions.maxCardLeftSpread || 0;
  const handCardDragged = useSelector((state: RootState) => state.draggedHandCard);
  const transitionsUnderway = useSelector((state: RootState) => state.transitionData.length > 0);
  const spread = dimensions.cardLeftSpread;

  const { x, y } = getPlacesLayout(id, playerZoneSize);
  return (
    <EmissaryHandler placeId={id} player={player} placeType={placeType}>
      {(handCards, emissaryCardIndex) => (
        
        <div
          id={id}
          style={{
            position: "absolute",
            // display: "flex",
            bottom: 30,
            // This causes whole card row to move left on spread
            left: x, //- (spread / 2 - 0.5) * handCards.length,
            //left: x - (spread / 2) * handCards.length,
            top: y,
            transition: "180ms",
            height: dimensions.cardHeight,
          }}
        >
          {handCards.map((card, index) => (
            <EnemyHandCard id={card.id} index={index} image={card.image} dimensions={dimensions} numHandCards={handCards.length} key={card.id} />
          ))}
        </div>
      )}
    </EmissaryHandler>
  );
};

export default EnemyHand;
