import { connect, useSelector } from "react-redux";
import CardGroup from "./CardGroup";
import Dragger from "./dndcomponents/Dragger";
import DraggerContainer from "./dndcomponents/DraggerContainer";
import GhostCardGroup from "./GhostCardGroup";
import { getDimensions } from "./helperFunctions/getDimensions";
import { getCardGroupsObjsnew } from "./helperFunctions/groupGCZCardNew";
import { getCardGroupObjs } from "./helperFunctions/groupGCZCards";
import TableCardMockRender from "./mockRender/TableCardMockRender";
import { RootState } from "./redux/store";

interface GCZProps {
  id: string;
  // enchantmentsRowCards: GameCard[];
  // GCZCards: GameCard[];
  // playerZoneSize: { width: number; height: number };
}

interface GCZReduxProps {
  draggedId?: string;
  emissaryCardGroupIndex?: number;
  isRearranging: boolean;
  isDraggingOver: boolean;
  isHighlighted: boolean;
  placeholder?: NewCardGroupObj;
  numElementsAt: number[];
  elementWidthAt: number[];
  cardGroups: NewCardGroupObj[];
}

function GCZ(props: GCZProps & GCZReduxProps) {
  const { id, isHighlighted, placeholder, isRearranging, numElementsAt, elementWidthAt, cardGroups, emissaryCardGroupIndex } = props;

  const allowDropping = isHighlighted || isRearranging; // || containsTargetedCard; // better name!°
  const dimensions = getDimensions(0, "GCZ");
  const { cardHeight, cardWidth } = dimensions;
  if (emissaryCardGroupIndex) console.log(emissaryCardGroupIndex + "is received emissary index GCZ");
  const devSettings = useSelector((state: RootState) => state.devSettings);

  return (
    <div
      id="pl0GCZ"
      className={devSettings.grid.on ? "place-grid" : ""}
      style={{
        display: "flex",
        // top: 100,
        position: "relative",
        margin: 0,
        // left: 600 - (dimensions.cardLeftSpread / 2) * GCZCards.length,
        left: 0,
        height: cardHeight * 1.5, // should grow when bffs/ zwilling in group
        minWidth: dimensions.cardWidth,
        verticalAlign: "center",
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
                transitionDelay: "100ms",
                minWidth: cardWidth,
              }
            : {}
        }
      >
        {cardGroups.map((cardGroup, index) =>
          emissaryCardGroupIndex === index ? (
            <TableCardMockRender cardId={cardGroup.cards[0].id} index={index} dimensions={dimensions} key={"emissary" + cardGroup.cards[0].id} />
          ) : (
            <Dragger draggerId={cardGroup.id} index={index} containerId={id} key={cardGroup.id} numElementsAt={numElementsAt}>
              {draggerProps => (
                <div ref={draggerProps.ref} onMouseDown={draggerProps.handleDragStart}>
                  <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} GCZId={id} />
                </div>
              )}
            </Dragger>
          )
        )}
      </DraggerContainer>

      {/* {ghostCardGroup ? <GhostCardGroup ghostCardGroup={ghostCardGroup} index={cumulativeWidthAt[convertedDraggedOverIndex ?? 0]} dimensions={dimensions} /> : null}
          {ghostCard ? <GhostCard index={numElementsAt[ghostCardIndex]} image={ghostCard.image} dimensions={dimensions} zIndex={0} /> : null} */}
    </div>
  );
}

/* isDropDisabled={!allowDropping}*/

const mapStateToProps = (state: RootState, ownProps: GCZProps) => {
  const { gameSnapshot, newSnapshotsNewVersion, animationTemplates, draggedState, highlights, draggedHandCard } = state;
  const { draggedId } = draggedState;
  const { id: placeId } = ownProps;

  let isDraggingOver = false;
  let placeholder = undefined;
  // this path should be figured out with
  // player slash place data;
  let cards = gameSnapshot.players[0].places.GCZ.cards;
  let cardGroups = getCardGroupsObjsnew(cards);
  let emissaryCardGroupIndex: number = -1;

  if (newSnapshotsNewVersion.length > 0 && animationTemplates.length > 0) {
    const templatesWithAnimationToThisPlace = animationTemplates[0]
      .filter(a => a.status !== "waitingInLine" && a.status !== "awaitingSimultaneousTemplates")
      .filter(a => "placeId" in a.to && a.to.placeId === placeId);

    if (templatesWithAnimationToThisPlace.length > 0) {
      cards = newSnapshotsNewVersion[0].players[0].places["GCZ"].cards;
      cardGroups = getCardGroupsObjsnew(cards);
    }
  }

  const elementWidthAt = cardGroups.map(cardGroup => cardGroup.width);
  const numElementsAt = cardGroups.map(cardGroup => cardGroup.size);

  const isHighlighted = highlights.includes(ownProps.id);
  const isRearranging = state.draggedState.destination?.containerId === ownProps.id;

  if (isRearranging) placeholder = cardGroups.find(e => draggedId === e.id);
  if (draggedHandCard)
    placeholder = {
      id: `cardGroup${draggedHandCard.name}`,
      width: 1,
      size: 1,
      cards: [draggedHandCard],
    };

  return { draggedId, isRearranging, isDraggingOver, elementWidthAt, cardGroups, numElementsAt, placeholder, isHighlighted, emissaryCardGroupIndex };
};

export default connect(mapStateToProps)(GCZ);
