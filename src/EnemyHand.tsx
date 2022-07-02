import { useEffect, useState } from "react";
import HandCard from "./HandCard";
import { Droppable } from "react-beautiful-dnd";
import { getAllDimensions } from "./helperFunctions/getAllDimensions";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import EnemyHandCard from "./EnemyHandCard";
import EmissaryHandler from "./transitionFunctions/EmissaryHandler";
import Hand from "./Hand";
import HandCardEmissary from "./HandCardEmissary";
import TableCardEmissary from "./TableCardEmissary";
import MockRenderProvider from "./mockRender/MockRenderProvider";
import TableCardMockRender from "./mockRender/TableCardMockRender";
import HandCardMockRender from "./mockRender/HandCardMockRender";
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
    <MockRenderProvider placeId={id} player={player} placeType={placeType}>
      {(handCards, mockRenderIds) => (
        
        <div
          id={id}
          style={{
            position: "absolute",
            // display: "flex",
            bottom: 30,
            // This causes whole card row to move left on spread
            left: 0- (spread / 2 - 0.5) * handCards.length,
            //left: x - (spread / 2) * handCards.length,
            top: y,
            transition: "180ms",
            height: dimensions.cardHeight,
          }}
        >
          {handCards.map((card, index) => (
            mockRenderIds.includes(card.id) ? <HandCardMockRender dimensions={dimensions} cardId= {card.id} index={index} numHandCards={handCards.length} spread={spread}/> :
            <EnemyHandCard id={card.id} index={index} image={card.image} dimensions={dimensions} numHandCards={handCards.length} key={card.id} />
          ))}
        </div>
      )}
    </MockRenderProvider>
  );
};

export default EnemyHand;
