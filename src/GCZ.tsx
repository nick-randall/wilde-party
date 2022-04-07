import { connect, useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import Dragger from "./dndcomponents/Dragger";
import DraggerContainer from "./dndcomponents/DraggerContainer";
import GhostCardGroup from "./GhostCardGroup";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupsObjsnew } from "./helperFunctions/groupGCZCardNew";
import { getCardGroupObjs } from "./helperFunctions/groupGCZCards";
import { RootState } from "./redux/store";

interface GCZProps {
  id: string;
  enchantmentsRowCards: GameCard[];
  GCZCards: GameCard[];
  playerZoneSize: { width: number; height: number };
}

interface GCZReduxProps {
  draggedId?: string;
  showEmissaries: boolean;
  isRearranging: boolean;
  isDraggingOver: boolean;
  isHighlighted: boolean;
  placeholder?: NewCardGroupObj;
  numElementsAt: number[];
  elementWidthAt: number[];
  cardGroups: NewCardGroupObj[];
}

function GCZ(props: GCZProps & GCZReduxProps) {
  const {
    id,
    enchantmentsRowCards,
    isHighlighted,
    playerZoneSize,
    placeholder,
    isRearranging,
    numElementsAt,
    elementWidthAt,
    cardGroups,
    showEmissaries,
    isDraggingOver,
  } = props;

  const allowDropping = isHighlighted || isRearranging; // || containsTargetedCard; // better name!°
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
      <DraggerContainer
        id={id}
        elementWidth={cardWidth}
        numElementsAt={numElementsAt}
        elementWidthAt={elementWidthAt}
        placeHolder={placeholder && <GhostCardGroup ghostCardGroup={placeholder} dimensions={dimensions} />}
        containerStyles={
          isRearranging || isHighlighted
            ? {
                backgroundColor: "yellowgreen",
                boxShadow: "0px 0px 30px 30px yellowgreen",
                transition: "background-color 180ms, box-shadow 180ms, left 180ms",
              }
            : {}
        }
      >
        {cardGroups.map((cardGroup, index) => (
          <Dragger draggerId={cardGroup.id} index={index} containerId={id} key={cardGroup.id} numElementsAt={numElementsAt}>
            {draggerProps => (
              <div ref={draggerProps.draggerRef} onMouseDown={draggerProps.handleDragStart}>
                <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} GCZId={id} />
              </div>
            )}
          </Dragger>
        ))}
      </DraggerContainer>

      {/* {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cumulativeWidthAt[convertedDraggedOverIndex ?? 0]} dimensions={dimensions} /> : null}
          {ghostCard ? <GhostCard index={numElementsAt[ghostCardIndex]} image={ghostCard.image} dimensions={dimensions} zIndex={0} /> : null} */}
    </div>
  );
}

/* isDropDisabled={!allowDropping}*/

// export default GCZ;

const mapStateToProps = (state: RootState, ownProps: GCZProps) => {
  let showEmissaries = false;
  let isDraggingOver = false;
  let placeholder = undefined;
  const { snapshotChangeData, draggedId, highlights, draggedHandCard } = state;
  const cardGroups = getCardGroupsObjsnew(ownProps.GCZCards);
  const elementWidthAt = cardGroups.map(cardGroup => cardGroup.width);
  const numElementsAt = cardGroups.map(cardGroup => cardGroup.size);
 
  const isHighlighted = highlights.includes(ownProps.id);
  const isRearranging = state.draggedState.destination?.containerId === ownProps.id;
  
  if (isRearranging) placeholder = cardGroups.find(e => draggedId === e.id);
  if (draggedHandCard) placeholder = {
    id: `cardGroup${draggedHandCard.name}`,
    width: 1,
    size: 1,
    cards: [draggedHandCard],
  };

  snapshotChangeData.forEach(change => {
    if (change.to.placeId === ownProps.id) {
      // const emissary: CardEmissaryProps = {
      //   id: change.to.cardId

      // }
      // emissaries.push(change.to.index)
      showEmissaries = true;
    }
  });
  return { draggedId, isRearranging, isDraggingOver, elementWidthAt, cardGroups, numElementsAt, placeholder, isHighlighted, showEmissaries };
};

export default connect(mapStateToProps)(GCZ);
