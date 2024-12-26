import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";
import { RootState } from "../redux/store";
import {  getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import { getCardGroupsObjs, NewCardGroupObj } from "../helperFunctions/groupGCZCards";

interface GCZProps {
  id: number;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  player: number
}


const cumulativeSum = (numbers: number[]) =>
  numbers.reduce<number[]>((acc, curr) => (acc.length === 0 ? [curr] : [...acc, acc[acc.length - 1] + curr]), []);

const getCardRowShapeOnDraggedOver = (cardRow: NewCardGroupObj[]) => {
  // let i = 0;
  // return cardRow.map(cardGroup => {
  //   const cumulativeWidth = i;
  //   i += cardGroup.size;
  //   return cumulativeWidth;
  // });
  const sizes = cardRow.map(cardGroup => cardGroup.size);
  return cumulativeSum(sizes);
};

const getCardRowShapeOnRearrange = (cardRow: NewCardGroupObj[], sourceIndex: number) => {
  const sizes = cardRow.map(cardGroup => cardGroup.size);
  sizes.splice(sourceIndex, 1);
  sizes.unshift(0);
  return cumulativeSum(sizes);
  //   pipe(mapSizes, removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(cardGroups);
};

function GCZ(props: GCZProps) {
  const { id, enchantmentsRowCards, GCZCards, player } = props;

  const {draggedOver, rearrangingData, draggedHandCard, highlights} = useSelector((state: RootState) => state.dragEventState);
  const {currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState)
  const { cardWidth, cardHeight  } = getCardStyleValuesFromPlaceAndPlayer("guestCardZone", player, currSnapshot);

  const droppableId = JSON.stringify({ type: "place", id });

  const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
  const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);
  const cardRowShape = rearrangingData.placeId === id ? getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex) : getCardRowShapeOnDraggedOver(cardRow);
  
  const ghostCardGroup = cardRow.find(e => rearrangingData.draggedId === e.id);
  console.log("ghostCardGroup", ghostCardGroup);
  const isHighlighted = highlights.includes(id);
  console.log(enchantmentsRowCards)

  const rearranging = useSelector((state: RootState) => state.dragEventState.rearrangingData.placeId === id);

  // const containsTargetedCard =
  //   highlights.some(h => enchantmentsRowCards.map(e => e.id).includes(h)) || highlights.some(h => GCZCards.map(e => e.id).includes(h));

  const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  return (
    <Droppable droppableId={droppableId} direction="horizontal" isDropDisabled={!allowDropping}>
      {provided => (
        <div
        className="pl0GCZ"
        
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            // display: "flex",
            // top: 100,
            // position: "absolute",
            margin: 0,
            border: "1px solid black",
            //left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
            height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
            minWidth: cardWidth,
            backgroundColor: isHighlighted ? "yellowgreen" : "",
            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
            transition: "background-color 180ms, box-shadow 180ms, left 180ms",
          }}
        >
          {cardRow.map((cardGroup, index) => (
            <CardGroup cardGroup={cardGroup} index={index} key={cardGroup.id} />
          ))}
          {provided.placeholder}

          {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cardRowShape[ghostCardIndex]} /> : null}
          {ghostCard ? <GhostCard cardId ={ghostCard.id} index={cardRowShape[ghostCardIndex]} imageName={ghostCard.imageName} zIndex={0} /> : null}
        </div>
      )}
    </Droppable>
  );
}

export default GCZ;
