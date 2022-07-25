import { connect, useSelector } from "react-redux";
import Dragger from "../dndcomponents/Dragger";
import DraggerContainer from "../dndcomponents/DraggerContainer";
import { getDimensions } from "../helperFunctions/getDimensions";
import { getCardGroupsObjs } from "../helperFunctions/groupGCZCards";
import MockRenderProvider from "../mockRender/MockRenderProvider";
import { RootState } from "../redux/store";
import CardGroup from "./CardGroup";
import GhostCardGroup from "./GhostCardGroup";

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
    <MockRenderProvider placeId={id} placeType="GCZ" player={0}>
      {(cards, mockRenderIds) => (
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
            {getCardGroupsObjs(cards).map((cardGroup, index) => (
              <Dragger draggerId={cardGroup.id} index={index} containerId={id} key={cardGroup.id} numElementsAt={numElementsAt}>
                {draggerProps => (
                  <div ref={draggerProps.ref} onMouseDown={draggerProps.handleDragStart}>
                    <CardGroup cardGroup={cardGroup} index={index} dimensions={dimensions} key={cardGroup.id} GCZId={id} mockRenderIds={mockRenderIds} />
                  </div>
                )}
              </Dragger>
            ))}
          </DraggerContainer>
        </div>
      )}
    </MockRenderProvider>
  );
}

/* isDropDisabled={!allowDropping}*/

const mapStateToProps = (state: RootState, ownProps: GCZProps) => {
  const { gameSnapshot, newSnapshots, draggedState, highlights, draggedHandCard } = state;
  const { draggedId } = draggedState;
  const { id } = ownProps;

  let isDraggingOver = false;
  let placeholder = undefined;
  // this path should be figured out with
  // player slash place data;
  let cards = gameSnapshot.players[0].places.GCZ.cards;
  let cardGroups = getCardGroupsObjs(cards);

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

  return { draggedId, isRearranging, isDraggingOver, elementWidthAt, cardGroups, numElementsAt, placeholder, isHighlighted };
};

export default connect(mapStateToProps)(GCZ);
