import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { PlayerLayout } from "./dimensions/getPlayersLayout";
import Dragger from "./dndcomponents/Dragger";
import DraggerContainer from "./dndcomponents/DraggerContainer";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupsObjsnew, getGCZWidthMap } from "./helperFunctions/groupGCZCardNew";
import { getCardGroupObjs, getCardRowShapeOnDraggedOver, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { RootState } from "./redux/store";

interface GCZProps {
  id: string;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

function GCZ(props: GCZProps) {
  const { id, enchantmentsRowCards, GCZCards, playerZoneSize } = props;

  const draggedOver = useSelector((state: RootState) => state.dragUpdate);
  const rearrange = useSelector((state: RootState) => state.rearrangingData);

  const ghostCardIndex = draggedOver.droppableId === id ? draggedOver.index : rearrange.sourceIndex;
  const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);
  const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

  const cardRow = getCardGroupObjs(enchantmentsRowCards, GCZCards);
  // const cardRowShape = rearrange.placeId === id ? getCardRowShapeOnRearrange(cardRow, rearrange.sourceIndex) : getCardRowShapeOnDraggedOver(cardRow);
  const ghostCardGroup = cardRow.find(e => rearrange.draggableId === e.id);

  const highlights = useSelector((state: RootState) => state.highlights);

  const isHighlighted = highlights.includes(id);

  const rearranging = useSelector((state: RootState) => state.rearrangingData.placeId === id);

  const cardGroups = getCardGroupsObjsnew(GCZCards);

  const numElementsAt = cardGroups.map(cardGroup => cardGroup.size);


  const elementWidthAt = getGCZWidthMap(GCZCards);
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
        //left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
        left: 200,
        top: y,
        height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
        minWidth: dimensions.cardWidth,
        backgroundColor: isHighlighted ? "yellowgreen" : "",
        boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
        transition: "background-color 180ms, box-shadow 180ms, left 180ms",
        border: "thin red solid"
        
      }}
    >
      <DraggerContainer id={id} elementWidth={cardWidth} numElementsAt={numElementsAt} elementWidthAt={elementWidthAt}>{/* isDropDisabled={!allowDropping}*/}
        {cardRow.map((cardGroup, index) => (
          <Dragger draggerId={cardGroup.id} index={index} containerId={id} key={cardGroup.id} numElementsAt={numElementsAt}>
            {(draggerProps) => (
              <div ref={draggerProps.draggerRef} onMouseDown={draggerProps.handleDragStart}>
                <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} GCZId={id}/>
              </div>
            )}
          </Dragger>
        ))}

        {/* {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cardRowShape[ghostCardIndex]} dimensions={dimensions} /> : null}
          {ghostCard ? <GhostCard index={cardRowShape[ghostCardIndex]} image={ghostCard.image} dimensions={dimensions} zIndex={0} /> : null} */}
      </DraggerContainer>
    </div>
  );
}

export default GCZ;
