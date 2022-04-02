import { pipe, map } from "ramda";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { PlayerLayout } from "./dimensions/getPlayersLayout";
import { draggedOverindexFromMapped, removeSourceIndex } from "./dndcomponents/dragEventHelperFunctions";
import Dragger from "./dndcomponents/Dragger";
import DraggerContainer from "./dndcomponents/DraggerContainer";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupsObjsnew } from "./helperFunctions/groupGCZCardNew";
import { addZeroAtFirstIndex, getCardGroupObjs, getCardRowShapeOnDraggedOver, getCardRowShapeOnRearrange, getCumulativeSum } from "./helperFunctions/groupGCZCards";
import { RootState } from "./redux/store";

interface GCZProps {
  id: string;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

function GCZ(props: GCZProps) {
  const { id, enchantmentsRowCards, GCZCards, playerZoneSize } = props;

  const rearranging = useSelector((state: RootState) => state.draggedState.destination?.containerId === id);
  // const rearrange = useSelector((state: RootState) => state.rearrangingData);
  const draggedId = useSelector((state: RootState) => state.draggedId);
  // const ghostCardIndex = draggedOver.droppableId === id ? draggedOver.index : rearrange.sourceIndex;
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  // const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const cardRow = getCardGroupObjs(enchantmentsRowCards, GCZCards);
  // const cardRowShape = rearrange.placeId === id ? getCardRowShapeOnRearrange(cardRow, rearrange.sourceIndex) : getCardRowShapeOnDraggedOver(cardRow);

  const highlights = useSelector((state: RootState) => state.highlights);

  const isHighlighted = highlights.includes(id);

  // const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);

  const cardGroups = getCardGroupsObjsnew(GCZCards);
  const ghostCardGroup = cardGroups.find(e => draggedId === e.id) ;
  const destination = useSelector((state: RootState) => state.draggedState.destination)
  const source = useSelector((state: RootState) => state.draggedState.source)
  console.log(rearranging)


  const elementWidthAt = cardGroups.map(cardGroup => cardGroup.width)//getGCZWidthMap(GCZCards);
  const numElementsAt = cardGroups.map(cardGroup => cardGroup.size);
/**
 * the steps to getting back to the correct index for the ghost cards:
 * convert the dragged over index back to the simple index
 * Create the cumulativeWidthAt [0, 1, 3 , 4]
 * find the draggedOVerIndex: mapWidthAt[convertedDraggedOverIndex]
 * 
 */
  const convertedDraggedOverIndex = ghostCardGroup ? draggedOverindexFromMapped(destination?.index ?? 0, numElementsAt, source?.index ?? 0, rearranging): undefined
  const cumulativeWidthAt = pipe(removeSourceIndex(source?.index ?? 0), getCumulativeSum, addZeroAtFirstIndex)(elementWidthAt);

  console.log(cumulativeWidthAt )
  console.log("draggedOVerIndex " + convertedDraggedOverIndex + destination?.index)
  // const containsTargetedCard =
  //   highlights.some(h => enchantmentsRowCards.map(e => e.id).includes(h)) || highlights.some(h => GCZCards.map(e => e.id).includes(h));

  const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
  const dimensions = getAllDimensions(id);
  const { cardHeight, cardWidth } = dimensions;
  const { x, y } = getPlacesLayout(id, playerZoneSize);

  return (
    <div
      className="pl0GCZ"
      style={{
        // display: "flex", 
        // top: 100,
        position: "absolute",
        margin: 0,
        // left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
        left: 0,
        top: y,
        height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
        minWidth: dimensions.cardWidth,
       
        // border: "thin red solid"
        
      }}
    >
      <DraggerContainer id={id} elementWidth={cardWidth} numElementsAt={numElementsAt} elementWidthAt={elementWidthAt} 
      containerStyles={ rearranging ? { backgroundColor: isHighlighted || rearranging ? "yellowgreen" : "",
        boxShadow: isHighlighted || rearranging ? "0px 0px 30px 30px yellowgreen" : "",
        transition: "background-color 180ms, box-shadow 180ms, left 180ms"}:{}}
      > 
        {cardGroups.map((cardGroup, index) => (
          <Dragger draggerId={cardGroup.id} index={index} containerId={id} key={cardGroup.id} numElementsAt={numElementsAt}>
            {(draggerProps) => (
              <div ref={draggerProps.draggerRef} onMouseDown={draggerProps.handleDragStart}>
                <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} GCZId={id}/>
              </div>
            )}
          </Dragger>
        ))}
 </DraggerContainer>

 {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cumulativeWidthAt[convertedDraggedOverIndex ?? 0]} dimensions={dimensions} /> : null}
          {/* {ghostCard ? <GhostCard index={numElementsAt[ghostCardIndex]} image={ghostCard.image} dimensions={dimensions} zIndex={0} /> : null} */}
     
    </div>
  );
}
{/* isDropDisabled={!allowDropping}*/}
export default GCZ;
