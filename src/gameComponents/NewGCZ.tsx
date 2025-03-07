import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
    dimensionConstants,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    getCardRowShapeOnRearrange,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import { Draggable, Droppable } from "react-beautiful-dnd";
import NewCardGroup from "./NewCardGroup";
import { getEnchantableNeighbours } from "../helperFunctions/canEnchantNeighbour";
import AnimatedCard from "./AnimatedCard";
import "../css/global.css";
import ExperimentCardGroup from "./ExperimentCardGroup";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";

interface NewGCZProps {
    id: number;
    gameSnapshot: GameSnapshot;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const NewGCZ: React.FC<NewGCZProps> = ({ id, gameSnapshot, player, registerPlaceOffset }) => {
    const { draggedOver, rearrangingData, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { cardWidth, cardHeight } = getCardStyleValuesFromPlaceAndPlayer(
        "guestCardZone",
        player,
        gameSnapshot
    );
    // console.log(GCZCards);
    const droppableId = JSON.stringify({ type: "place", id, placeType: "guestCardZone", player });

    const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;
    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;
    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    const cardRowShape =
        rearrangingData.placeId === id
            ? getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex)
            : getCardRowShapeOnDraggedOver(cardRow);
    console.log("cardrow", cardRow);
    console.log("cardRowShape", cardRowShape);
    cardRowShape.unshift(0);

    const ghostCardGroup = cardRow.find((e) => rearrangingData.draggedId === e.id);
    const isHighlighted = highlights.includes(id);

    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );
    const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°

    return (
        <div ref={(el) => registerPlaceOffset(el, id)} style={{ position: "relative" }}>
            <Droppable
                droppableId={droppableId}
                direction="horizontal"
                isDropDisabled={!allowDropping}
            >
                {(provided) => (
                    <div
                        className={`pl0GCZ ${isHighlighted ? "highlighted" : ""}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            // position: "relative",
                            display: "flex",
                            height: cardHeight,
                            minWidth: cardWidth,
                            // border: "1px solid black",
                            // height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
                        }}
                    >
                        {cardRow.map((cardGroup, index) =>
                            !animationCardIds.includes(cardGroup.id) ? (
                                <ExperimentCardGroup
                                    cardGroup={cardGroup}
                                    cardGroupIndex={index}
                                    physicalIndex={cardRowShape[index]}
                                />
                            ) : (
                                //   const draggableData: DraggableData = {
                                //     id: cardGroup.id,
                                //     type: "cardGroup",
                                //     numCards: cardGroup.cards.length,
                                // };
                                //  return !animationCardIds.includes(cardGroup.id) ? (
                                //       <Draggable draggableId={JSON.stringify(draggableData)} index={index}>
                                //           {(d) => (
                                //               <div {...d.draggableProps} ref={d.innerRef} {...d.dragHandleProps}>
                                //                   <img
                                //                       src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                                //                       alt={cardGroup.cards[0].imageName}
                                //                       draggable="false"
                                //                       style={{
                                //                           // position: "absolute",
                                //                           height: cardHeight,
                                //                           width: cardWidth,
                                //                           left: cardWidth * cardRowShape[index],
                                //                           zIndex: 99,
                                //                           ...d.draggableProps.style,
                                //                           borderRadius:
                                //                               dimensionConstants.CARD_BORDER_RADIUS,
                                //                       }}
                                //                   />
                                //               </div>
                                //           )}
                                //       </Draggable>
                                <AnimatedCard
                                    key={cardGroup.id}
                                    id={cardGroup.id}
                                    currAnimations={animations.filter(
                                        (a) => a.cardId === cardGroup.id && a.placeId === id
                                    )}
                                    imageName={cardGroup.cards[0].imageName}
                                    index={index}
                                    gameSnapshot={gameSnapshot}
                                />
                            )
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {ghostCard && draggedHandCard && (
                <GhostCard
                    cardId={draggedHandCard.id}
                    index={draggedOver?.index ?? 0}
                    imageName={draggedHandCard.imageName}
                    zIndex={0}
                />
            )}
            {ghostCardGroup && ghostCardIndex !== undefined && (
                <GhostCardGroup ghostCardGroup={ghostCardGroup} index={ghostCardIndex} />
            )}
        </div>
    );
};

export default NewGCZ;
