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
import TableCardEmissary from "./TableCardEmissary";

interface GCZProps {
  id: string;
  // enchantmentsRowCards: GameCard[];
  // GCZCards: GameCard[];
  playerZoneSize: { width: number; height: number };
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
  const { id, isHighlighted, playerZoneSize, placeholder, isRearranging, numElementsAt, elementWidthAt, cardGroups, emissaryCardGroupIndex } = props;

  const allowDropping = isHighlighted || isRearranging; // || containsTargetedCard; // better name!°
  const dimensions = getAllDimensions(id);
  const { cardHeight, cardWidth } = dimensions;
  const { x, y } = getPlacesLayout(id, playerZoneSize);
  if (emissaryCardGroupIndex) console.log(emissaryCardGroupIndex + "is received emissary index GCZ");
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
        height: cardHeight * 1.5, // should grow when bffs/ zwilling in group
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
        {cardGroups.map((cardGroup, index) =>
          emissaryCardGroupIndex === index ? (
            <TableCardEmissary
              id={cardGroup.cards[0].id}
              index={index}
              image={cardGroup.cards[0].image}
              dimensions={dimensions}
              key={"emissary" + cardGroup.cards[0].id}
            />
          ) : (
            <Dragger draggerId={cardGroup.id} index={index} containerId={id} key={cardGroup.id} numElementsAt={numElementsAt}>
              {draggerProps => (
                <div ref={draggerProps.draggerRef} onMouseDown={draggerProps.handleDragStart}>
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
  const { gameSnapshot, newSnapshots, draggedState, highlights, draggedHandCard } = state;
  const { draggedId } = draggedState;
  const { id } = ownProps;
  console.log(draggedId)

  let isDraggingOver = false;
  let placeholder = undefined;
  // this path should be figured out with
  // player slash place data;
  let cards = gameSnapshot.players[0].places.GCZ.cards;
  let cardGroups = getCardGroupsObjsnew(cards);
  let emissaryCardGroupIndex: number = -1;

  if (newSnapshots.length > 0) {
    newSnapshots[0].transitionTemplates.forEach(template => {
      const placeId = "placeId" in template.to ? template.to.placeId : undefined; // will this work???

      // if place contains a card transitioning to or from it..
      if (placeId === id) {
        //TODO sort somtehing like this:
        // if (template.to.placeId === id || template.from.placeId === id) {
        switch (template.status) {
          case "waitingInLine":
            break;

          case "awaitingEmissaryData":
            cards = newSnapshots[0].players[0].places.GCZ.cards;
            cardGroups = getCardGroupsObjsnew(cards);
            console.log("listening to newSnapshot");
            const groups: CardGroup[] = cardGroups.map(group => group.cards);
            groups.forEach((cards, cardsIndex) =>
              cards.forEach(card => {
                console.log(card.id);
                console.log(template.to.cardId);
                if (card.id === template.to.cardId) emissaryCardGroupIndex = cardsIndex;
              })
            );
            // emissaryCardGroupIndex = cardGroups
            //   .map(group => group.cards)
            //   .findIndex(cards => cards.find(card => card.id === template.to.cardId) !== undefined);
            console.log("listening to newSnapshot and awaitingEmissary at index " + emissaryCardGroupIndex);
            break;
          case "underway":
            console.log("listening to newSnapshot");
            cards = newSnapshots[0].players[0].places.GCZ.cards;
            cardGroups = getCardGroupsObjsnew(cards);
          // case "complete" :
          //   break; ???
        }
      }
      if (placeId === id) {
        console.log("template from");
        switch (template.status) {
          case "underway":
            cards = newSnapshots[0].players[0].places["GCZ"].cards;
            cardGroups = getCardGroupsObjsnew(cards);
        }
      }
    });
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
